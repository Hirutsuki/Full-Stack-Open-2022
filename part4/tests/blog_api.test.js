const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')
const Blog = require('../models/blog')

jest.setTimeout(15000)
const initialBlogs = helper.initialBlogs

beforeEach(async () => {
  await Blog.deleteMany({})

  for (const blog of initialBlogs) {
    await new Blog(blog).save()
  }
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('saved blogs have the unique identifier named "id"', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs[0].id).toBeDefined()
    expect(blogs[0]._id).not.toBeDefined()
  })
})

describe('viewing a specific blog', () => {
  test('succeeds with a valid id', async () => {
    const blogs = await helper.blogsInDb()
    const response = await api
      .get(`/api/blogs/${blogs[0].id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const processedBlogToView = JSON.parse(JSON.stringify(blogs[0]))
    expect(response.body).toEqual(processedBlogToView)
  })
})

describe('addition of a new blog', () => {
  test('succeeds with valid data', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', this.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(initialBlogs.length + 1)

    expect(Boolean(blogsAfter.find(blog => blog.title === newBlog.title))).toBe(
      true
    )
  })

  test('blog without likes property is set a default likes value of 0', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/'
    }

    await api
      .post('/api/blogs')
      .set('Authorization', this.token)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    const addedBlog = blogsAfter.find(blog => blog.title === newBlog.title)
    expect(addedBlog.likes).toBe(0)
  })

  test('creation fails with status code 400 if title undefined', async () => {
    const newBlog = {
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', this.token)
      .send(newBlog)
      .expect(400)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(initialBlogs.length)
  })

  test('fails with status code 400 if url undefined', async () => {
    const newBlog = {
      title: 'React patterns',
      author: 'Michael Chan',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', this.token)
      .send(newBlog)
      .expect(400)
    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(initialBlogs.length)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsBefore = await helper.blogsInDb()

    await api
      .delete(`/api/blogs/${blogsBefore[0].id}`)
      .set('Authorization', this.token)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter).toHaveLength(initialBlogs.length - 1)

    const titles = (await blogsAfter).map(blog => blog.title)
    expect(titles).not.toContain(blogsBefore[0].title)
  })
})

describe('update of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const newBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 7
    }
    const blogsBefore = await helper.blogsInDb()
    await api
      .put(`/api/blogs/${blogsBefore[0].id}`)
      .set('Authorization', this.token)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAfter = await helper.blogsInDb()
    expect(blogsAfter[0].likes).toBe(newBlog.likes)
  })
})

afterAll(() => {
  mongoose.connection.close()
})