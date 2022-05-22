import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'title',
    url: 'url',
    author: 'author',
    likes: 0,
    user: { id: '628288b6a0e22de9dc17720d', name: 'user', username: 'user' }
  }

  let container
  const mockUpdateLikes = jest.fn()
  const mockDeleteBlog = jest.fn()

  beforeEach(() => {
    container = render(
      <Blog
        updateLikes={mockUpdateLikes}
        deleteBlog={mockDeleteBlog}
        blog={blog}
        loggedUser={'user'}
      />
    ).container
  })

  test('renders title and author', () => {
    const div = container.querySelector('.blogBasic')
    expect(div).not.toHaveStyle('display: none')
  })

  test('at start url and number of likes are not displayed', () => {
    const div = container.querySelector('.blogDetail')
    expect(div).toHaveStyle('display: none')
  })

  test('after clicking the button, url and number of likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const div = container.querySelector('.blogDetail')
    expect(div).not.toHaveStyle('display: none')
  })

  test('mockUpdateLikes is called twice if the like button is clicked twice', async() => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.dblClick(button)
    expect(mockUpdateLikes.mock.calls).toHaveLength(2)
  })
})