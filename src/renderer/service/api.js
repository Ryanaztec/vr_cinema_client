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

export const getInfo = params => {
  return axios({
    url: '/user/current',
    method: 'get',
    params: { params }
  })
}

export const getMovie = params => {
  return axios({
    url: 'movie-by-seat',
    method: 'post',
    params
  })
}

export default {
  example,
  login,
  getInfo,
  getMovie
}
