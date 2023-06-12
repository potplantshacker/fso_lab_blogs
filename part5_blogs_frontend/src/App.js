import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import { Notification, NotificationError } from './components/Notification'


const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationErrorMessage, setNotificationErrorMessage] = useState(null)
  const [blogListRefresh, setBlogListRefresh] = useState(0)

  const noteFormRef = useRef()

  // Fetch all blogs
  useEffect(() => {
    blogService.getAll().then(blogs => {
      const blogsOrderedByLikes = blogs.sort((a, b) => b.likes - a.likes)
      setBlogs(blogsOrderedByLikes)
    })
  }, [blogListRefresh])

  // Check local storage for already logged in user
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  // Adding new blog
  const handleNewBlog = (blogObject) => {
    noteFormRef.current.toggleVisibility()
    blogService
      .createNew(blogObject)
      .then(returnedBlog => {
        setBlogListRefresh(Math.random)
        setNotificationMessage(`'${returnedBlog.title}' added`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(`Error adding blog. Message: '${error}'`)
        setNotificationErrorMessage(
          `Error occurred while attempting to add new blog. Message: ${error.response.data.error}`
        )
        console.log(error.response)
        setTimeout(() => {
          setNotificationErrorMessage(null)
        }, 5000)
      })
  }

  // Log in
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      // Display successfully login message
      setNotificationMessage(`Successfully logged in as: '${user.username}'`)

      // Clear it after 5 seconds
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    } catch (exception) {
      setNotificationErrorMessage('Wrong credentials')
      setTimeout(() => {
        setNotificationErrorMessage(null)
      }, 5000)
      console.log('Wrong credentials')
    }
  }


  //Log out
  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogAppUser')

    setNotificationMessage(`Successfully logged out '${user.username}'`)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)

    return
  }

  // Liking new blog
  const handleLike = (id) => {
    blogService
      .likeBlog(id)
      .then(returnedBlog => {
        setBlogListRefresh(Math.random)

        setNotificationMessage(`'${returnedBlog.data.title}' successfully liked/unliked`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })
      .catch(error => {
        console.log(`Error liking blog. Message: '${error}'`)
        setNotificationErrorMessage(
          `Error occurred while attempting to like a blog. Message: ${error.response.data.error}`
        )
        setTimeout(() => {
          setNotificationErrorMessage(null)
        }, 5000)
      })
  }

  // Deleting new blog
  const handleDelete = (blogObject) => {
    if (window.confirm(`Do you want to delete '${blogObject.title}' ?`)) { // Delete
      blogService
        .deleteBlog(blogObject.id)
        .then(returnedBlog => {
          setBlogListRefresh(Math.random)

          setNotificationMessage(`'${returnedBlog.data.title}' successfully deleted`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
        .catch(error => {
          console.log(`Error deleting blog. Message: '${error}'`)
          setNotificationErrorMessage(
            `Error occurred while attempting to delete a blog. Message: ${error.response.data.error}`
          )
          setTimeout(() => {
            setNotificationErrorMessage(null)
          }, 5000)
        })
    }
  }




  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notificationMessage} />
      <NotificationError message={notificationErrorMessage} />
      {user === null && loginForm()}
      {user && <div>
        <p>Logged in: {user.name} <button onClick={handleLogout}>Logout</button></p>
        <Togglable buttonLabel='new blog' ref={noteFormRef}>
          <BlogForm createBlog={handleNewBlog} ></BlogForm>
        </Togglable>
        <h2>All blogs:</h2>
        <div className='bloglist'>
          {
            blogs.map(blog =>
              <Blog key={blog.id} blog={blog} user={user} likeBlog={handleLike} deleteBlog={handleDelete} />
            )
          }
        </div>
      </div>
      }
    </div>
  )
}


export default App



