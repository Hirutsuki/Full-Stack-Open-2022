/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import ToggleDisplay from './components/ToggleDisplay'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState({})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs(blogs))
  }, [blogs])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (type, content) => {
    setErrorMessage({ type, content })
    setTimeout(() => setErrorMessage({}), 3000)
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)

      notify('passed', `welcome, ${user.name}`)

      setUsername('')
      setPassword('')
    } catch (error) {
      notify('error', error.response.data.error)
    }
  }

  const handleInput = ({ target }) => {
    eval(`set${target.name}(target.value)`)
  }

  class Input {
    constructor(label, type, value, name) {
      this.label = label
      this.type = type
      this.value = value
      this.name = name
    }
  }

  const loginInputs = [
    new Input('username', 'text', username, 'Username'),
    new Input('password', 'password', password, 'Password')
  ]
  loginInputs.map(input => Object.assign(input, { onChange: handleInput }))

  const blogFormRef = useRef()

  const addBlog = async event => {
    event.preventDefault()

    try {
      const blog = await blogService.create({ title, author, url })
      notify('passed', `a new blog ${title} by ${author} added`)
      setBlogs(blogs.concat(blog))
      blogFormRef.current.toggleVisibility()
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      notify('error', error.response.data.error)
    }
  }

  const updateLikes = blog => async () => {
    await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    })
  }

  const deleteBlog = blog => async () => {
    const { title, author } = blog
    if (window.confirm(`Remove blog ${title} by ${author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify('passed', `blog ${title} by ${author} removed`)
      } catch (error) {
        notify('error', error.response.data.error)
      }
    }
  }

  return user ? (
    <>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <p>
        {user.name} logged in
        <button
          onClick={() => {
            window.localStorage.removeItem('loggedUser')
            setUser(null)
          }}>
          logout
        </button>
      </p>
      <ToggleDisplay buttonLabel="create new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm
          addBlog={addBlog}
          handleInput={handleInput}
          Input={Input}
          title={title}
          author={author}
          url={url}
        />
      </ToggleDisplay>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog => {
          return (
            <Blog
              key={blog.id}
              updateLikes={updateLikes(blog)}
              deleteBlog={deleteBlog(blog)}
              blog={blog}
              loggedUser={user.username}
            />
          )
        })}
    </>
  ) : (
    <>
      <h2>log in to application</h2>
      <Notification message={errorMessage} />
      <LoginForm handleLogin={handleLogin} loginInputs={loginInputs} />
    </>
  )
}

export default App