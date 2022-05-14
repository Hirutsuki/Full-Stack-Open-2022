const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

jest.setTimeout(15000)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('password', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'admin',
      name: 'Administrator',
      password: 'password'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length + 1)

    expect(
      Boolean(usersAfter.find(user => user.username === newUser.username))
    ).toBe(true)
  })

  test('creation fails with status code 400 if username already taken', async () => {
    const usersBefore = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.error.text).toContain('`username` to be unique')

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })
})

describe('when provided with invalid user', () => {
  test('creation fails with status code 400 if username undefined', async () => {
    const newUser = {
      name: 'Administrator',
      password: 'password'
    }

    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('creation fails with status code 400 if password undefined', async () => {
    const newUser = {
      username: 'admin',
      name: 'Administrator'
    }

    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('creation fails with status code 400 if username length shorter than 3 characters', async () => {
    const newUser = {
      username: 'ad',
      name: 'Administrator',
      password: 'password'
    }

    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })

  test('creation fails with status code 400 if password length shorter than 3 characters', async () => {
    const newUser = {
      username: 'admin',
      name: 'Administrator',
      password: 'pw'
    }

    const usersBefore = await helper.usersInDb()

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await helper.usersInDb()
    expect(usersAfter).toHaveLength(usersBefore.length)
  })
})

afterAll(() => {
  mongoose.connection.close()
})