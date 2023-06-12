import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')



  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      'title': newTitle,
      'author': newAuthor,
      'url': newUrl
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div>
      <h3>Create new blog</h3>
      <form onSubmit={addBlog}>
        <div> title: <input className='blog-form-title' value={newTitle} onChange={event => setNewTitle(event.target.value)}/></div>
        <div> author: <input className='blog-form-author' value={newAuthor} onChange={event => setNewAuthor(event.target.value)}/> </div>
        <div> url: <input className='blog-form-url' value={newUrl} onChange={event => setNewUrl(event.target.value)}/> </div>
        <div>
          <button className='blog-form-submit-button' type="submit">Add blog</button>
        </div>
      </form>
    </div>
  )
}
export default BlogForm



