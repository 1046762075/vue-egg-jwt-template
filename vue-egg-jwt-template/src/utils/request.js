import axios from 'axios'

const request = axios.create({
  baseURL: process.env.API_ROOT // config/
})

// Set the interceptor to carry the token every request
request.interceptors.request.use((req) => {
  let token = localStorage.getItem('token')
  if (token) {
    req.headers.token = token
  }
  return req
})

export default request
