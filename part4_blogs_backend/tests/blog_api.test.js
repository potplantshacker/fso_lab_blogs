const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const app = require('../App')

const api = supertest(app)

const Blog = require('../models/blog')


beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})



test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})


test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContain(
        'Go To Statement Considered Harmful'
    )
})


test('a valid note can be added', async () => {
    const newNote = {
        title: "async/await simplifies making async calls",
        author: "Test poster",
        url: "This is required now",
        userId: "64807e8e66ce2f8e16e112d5",
        user: "64807e8e66ce2f8e16e112d5"
    }

    await api
        .post('/api/blogs')
        .set('Authorization', 'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QyIiwiaWQiOiI2NDgwN2U4ZTY2Y2UyZjhlMTZlMTEyZDUiLCJpYXQiOjE2ODYxNDYzOTV9.dhQmLUSZS953yLnedBwbVNANDDWZK8crsSFp95zztPk')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const notesAtEnd = await helper.notesInDb()
    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = notesAtEnd.map(n => n.title)
    expect(titles).toContain(
        'async/await simplifies making async calls'
    )
})

test('note without content is not added', async () => {
    const newNote = {
        author: "Test Author"
    }

    await api
        .post('/api/blogs')
        .send(newNote)
        .expect(400)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(helper.initialBlogs.length)
})





test('a specific note can be viewed', async () => {
    const notesAtStart = await helper.notesInDb()

    const noteToView = notesAtStart[0]

    const resultNote = await api
        .get(`/api/blogs/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const processedNoteToView = JSON.parse(JSON.stringify(noteToView))

    expect(resultNote.body).toEqual(processedNoteToView)
})

test('a note can be deleted', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToDelete = notesAtStart[0]

    await api
        .delete(`/api/blogs/${noteToDelete.id}`)
        .expect(204)

    const notesAtEnd = await helper.notesInDb()

    expect(notesAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
    )

    const titles = notesAtEnd.map(r => r.title)

    expect(titles).not.toContain(noteToDelete.title)
})

test('an id key exists', async () => {

    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
})


test('likes has default value of 0', async () => {
    const newNote = {
        id: "5a422aa71b54a676234dddddddd17f8",
        title: "Nobody likes this",
        author: "Excessive use of third party libraries",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/)


    const response = await api.get('/api/blogs')
    const blogCount = helper.initialBlogs.length;

    expect(response.body[blogCount].likes).toEqual(0)
})

test('if title value is missing return 400', async () => {
    const newNote = {
        id: "5a422aa71b54a676234dddddddd17f8",
        author: "Excessive use of third party libraries",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newNote)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('if url value is missing return 400', async () => {
    const newNote = {
        id: "5a422aa71b54a676234dddddddd17f8",
        title: "Nobody likes this",
        author: "Excessive use of third party libraries",
        __v: 0
    }

    await api
        .post('/api/blogs')
        .send(newNote)
        .expect(400)
        .expect('Content-Type', /application\/json/)
})

test('if liking a blog works', async () => {
    const notesAtStart = await helper.notesInDb()
    const noteToView = notesAtStart[0]

    await api
        .put(`/api/blogs/${noteToView.id}`)
        .expect(200)

    const resultBlog = await api
        .get(`/api/blogs/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)


    expect(resultBlog.body.likes).toEqual(noteToView.likes + 1)

})








// ---------------------------------- User tests
/* describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'joel',
            name: 'Joel Admin',
            password: 'root',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('expected `username` to be unique')

        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toEqual(usersAtStart)
    })
})
 */






afterAll(async () => {
    await mongoose.connection.close()
})


