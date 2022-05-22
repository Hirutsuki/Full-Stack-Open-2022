import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

class Input {
  constructor(label, type, value, name) {
    this.label = label
    this.type = type
    this.value = value
    this.name = name
  }
}
const handleInput = ({ target }) => {
  eval(`set${target.name}(target.value)`)
}

test('calls mockAddBlog with the right details', async () => {
  const mockAddBlog = jest.fn()
  const user = userEvent.setup()

  const container = render(
    <BlogForm addBlog={mockAddBlog} handleInput={handleInput} Input={Input} />
  ).container
  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const button = screen.getByText('create')

  await user.type(titleInput, 'title value')
  await user.type(authorInput, 'author value')
  await user.type(urlInput, 'url value')
  await user.click(button)

  expect(mockAddBlog).toHaveBeenCalledWith({
    title: 'title value',
    author: 'author value',
    url: 'url value'
  })
})