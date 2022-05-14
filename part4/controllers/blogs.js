const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const user = request.user

  if (body.title && body.url) {
    const blog = new Blog({ ...body, user: user._id })
    savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } else {
    response.status(400).json({ error: 'blog must have a title and an URL' })
  }
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).json({ error: 'no blog found' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true, runValidators: true, context: 'query' }
  )

  if (!updatedBlog) {
    response.status(404).json({ error: 'no blog found' })
  } else {
    response.status(200).json(updatedBlog)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({
      error: 'no blog found'
    })
  }

  if (blog.user.toString() === request.user._id.toString()) {
    await blog.delete()
    response.status(204).end()
  } else {
    response.status(401).json({ error: 'cannot delete a blog you do not own' })
  }
})

module.exports = blogsRouter