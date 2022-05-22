import { useState } from 'react'

const Blog = ({ updateLikes, deleteBlog, blog, loggedUser }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const { title, url, author, user } = blog

  return (
    <div style={blogStyle}>
      <div className="blogBasic">
        {title} {author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div style={{ display: visible ? '' : 'none' }} className="blogDetail">
        <div>{url}</div>
        <div>
          likes {blog.likes}
          <button onClick={updateLikes}>like</button>
        </div>
        <div>{user.name}</div>
        {user.username === loggedUser && (
          <button onClick={deleteBlog}>remove</button>
        )}
      </div>
    </div>
  )
}

export default Blog