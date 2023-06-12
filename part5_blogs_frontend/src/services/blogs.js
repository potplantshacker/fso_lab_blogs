import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

// GET blogs
const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// POST new blog
const createNew = async newObject => {
  const config = {
    headers: { Authorization: token }
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}


// Add or remove like
const likeBlog = async id => {
  const config = {
    headers: { Authorization: token }
  }

  const response = axios.put(`${baseUrl}/${id}`, [], config)
  return response
}

// DELETE blog
const deleteBlog = async id => {
  const config = {
    headers: { Authorization: token }
  }
  const response = axios.delete(`${baseUrl}/${id}`, config)
  return response
}

export default { getAll, createNew, setToken, likeBlog, deleteBlog }