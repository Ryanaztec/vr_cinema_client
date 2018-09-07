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
export const getAllTags = () => {
  return axios({
    url: '/tags/all-movie-tags',
    method: 'get'
  })
}
export const getAllMovies = () => {
  return axios({
    url: '/movie/all-movies',
    method: 'get'
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
  getAllTags,
  getAllMovies,
  getMovie
}
