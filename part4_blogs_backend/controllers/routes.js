const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ', '')
    }
    return null
}


// GET all blogs
blogsRouter.get('/', async (request, response, next) => {

    const blogs = await Blog
        .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
})

// POST blog
blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    try {
        const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)


        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }
        const user = await User.findById(decodedToken.id)

        body.user = user.id

        const savedBlog = await new Blog(body).save()
        user.notes = user.notes.concat(savedBlog.id)
        await user.save()
        response.status(201).json(savedBlog).end()
    } catch (error) {
        next(error)
    }

})


// GET specific blog
blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
            response.json(blog)
        } else {
            response.status(404).end()
        }
    } catch (error) {
        next(error)
    }
})

// DELETE blog
blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        // Verify that user is logged in     
        const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        const user = await User.findById(decodedToken.id)
        const blog = await Blog.findById(request.params.id)

        // No blog or user found with ID
        if (blog === null || user === null) {
            response.status(404).end()
        }

        // Verify right author
        if (blog.user.toString() !== user.id) {
            return response.status(401).json({ error: 'not author of blog' })
        }

        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (error) {
        next(error)
    }
})





// Like a blog
blogsRouter.put('/:id', async (request, response, next) => {
    try {
        // Verify that user is logged in     
        const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)

        if (!decodedToken.id) {
            return response.status(401).json({ error: 'token invalid' })
        }

        const user = await User.findById(decodedToken.id)

        let blog = await Blog.findById(request.params.id)

        // No blog found with ID
        if (blog === null) {
            response.status(404).end()
        }

        // If blog was already liked by user or not
        const alreadyLiked = blog.likedBy.includes(user.id)
        let newLikes = []

        if (alreadyLiked) {
            newLikes = blog.likedBy.filter(id => id !== user.id)
        } else {
            newLikes = blog.likedBy.concat(user.id)
        }

        blog.likedBy = newLikes
        blog.likes = newLikes.length

        let updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedBlog)
    } catch (error) {
        next(error)
    }
})





module.exports = blogsRouter