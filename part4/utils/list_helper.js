const _ = require('lodash')

const dummy = blogs => 1

const totalLikes = blogs =>
  blogs.map(blog => blog.likes).reduce((sum, likes) => sum + likes, 0)

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const found = blogs.sort((a, b) => b.likes - a.likes)[0]
  delete found._id
  delete found.url
  delete found.__v
  return found
}

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const countedPairs = _.countBy(blogs, 'author')
  const mappedArr = Object.keys(countedPairs).map(author => {
    return { author, blogs: countedPairs[author] }
  })
  return _.maxBy(mappedArr, 'blogs')
}

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return null
  }
  const grouppedPairs = _.groupBy(blogs, 'author')
  const summedGroups = Object.keys(grouppedPairs).map(author => {
    return { author, likes: _.sumBy(grouppedPairs[author], 'likes') }
  })
  return _.maxBy(summedGroups, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
