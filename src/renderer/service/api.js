import axios from './config'

export const example = params => {
  return axios({
    url: '/example',
    method: 'post',
    params
  })
}

export const login = params => {
  return axios({
    url: '/auth/login',
    method: 'post',
    params
  })
}

export const getInfo = () => {
  return axios({
    url: '/auth/currentUserInfo',
    method: 'get'
  })
}

export default {
  example,
  login
}
