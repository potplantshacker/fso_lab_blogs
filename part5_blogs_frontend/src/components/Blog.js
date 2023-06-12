import { useState } from 'react'


const Blog = ({ blog, user, likeBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const userIsAuthor = blog.user.id === user.id ? true : false

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const textWhenLiked = blog.likedBy.includes(user.id) ? 'Remove like' : 'Like'
  const deleteButtonDisplay = userIsAuthor ? { display: 'visible' } : { display: 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className='blog'>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
        <h3>{blog.title} - {blog.author}</h3>
        <div style={hideWhenVisible}>
          <button className='show-button' onClick={toggleVisibility}>View..</button>
        </div>
        <div style={showWhenVisible}>
          <button onClick={toggleVisibility}>Hide</button>
        </div>
      </div>
      <div style={showWhenVisible} className='detailedInfo'>
        {/* <BlogForm createBlog={handleNewBlog} ></BlogForm> */}
        <div>Title: {blog.title}</div>
        <div>Author: {blog.author}</div>
        <div>URL: {blog.url}</div>
        <div>Likes: {blog.likes} <button onClick={() => likeBlog(blog.id)} className='like-button'>{textWhenLiked}</button></div>
        <div>User: {blog.user.name}</div>
        <button style={deleteButtonDisplay} onClick={() => deleteBlog(blog)}>Delete blog</button>
      </div>
    </div >
  )
}

export default Blog