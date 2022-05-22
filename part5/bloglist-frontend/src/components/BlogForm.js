const BlogForm = ({ addBlog, handleInput, Input, title, author, url }) => {
  const blogInputs = [
    new Input('title', 'text', title, 'Title'),
    new Input('author', 'text', author, 'Author'),
    new Input('url', 'text', url, 'Url')
  ]
  blogInputs.map(input => Object.assign(input, { onChange: handleInput }))
  return (
    <form onSubmit={addBlog}>
      {blogInputs.map((input, index) => {
        const { label, type, value, name, onChange } = input
        return (
          <div key={index}>
            {label}:
            <input
              id={label}
              type={type}
              value={value}
              name={name}
              onChange={onChange}
            />
          </div>
        )
      })}
      <button id="createButton" type="submit">create</button>
    </form>
  )
}
export default BlogForm