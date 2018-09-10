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
export const getMovie = params => {
  return axios({
    url: '/cinema_movie/movie-by-seat',
    method: 'post',
    params
  })
}
export const getMoviesByTag = params => {
  return axios({
    url: '/movie/get-movies-by-tag',
    method: 'post',
    params
  })
}
export const getSeatByMac = params => {
  return axios({
    url: '/cinema_movie/get-seat-by-mac',
    method: 'post',
    params
  })
}

export default {
  example,
  login,
  getInfo,
  getAllTags,
  getMovie,
  getMoviesByTag,
  getSeatByMac
}
