import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const config = () => ({ headers: { Authorization: token } })

const create = async newObject => {
  const response = await axios.post(baseUrl, newObject, config())
  return response.data
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  return response.data
}

const remove = async id => {
  const response = await axios.delete(`${baseUrl}/${id}`, config())
  return response.data
}
export default { setToken, create, getAll, update, remove }