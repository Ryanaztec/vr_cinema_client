import axios from './config'

let refreshTimer = null
const refreshInterval = 1000 * 60 * 10

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
export const getNewMoviesCount = params => {
  return axios({
    url: '/cinema_movie/get-new-movies-count',
    method: 'post',
    params
  })
}

export const initTokenRefresher = currentUserStore => {
  if (!refreshTimer) {
    refreshTimer = setInterval(() => {
      currentUserStore.dispatch('RefreshToken')
    }, refreshInterval)
  }
}

export const refreshToken = () => {
  return axios({
    url: '/auth/refresh',
    method: 'post'
  })
}

export const removeTokenRefresher = () => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
}

export const getPlayingSeats = params => {
  return axios({
    url: '/cinema_movie/get-playing-seat',
    method: 'post',
    params
  })
}

export const storePlayRecord = params => {
  return axios({
    url: '/cinema_movie/store-playing-record',
    method: 'post',
    params
  })
}

export const updatePlayRecord = params => {
  return axios({
    url: '/cinema_movie/update-playing-record',
    method: 'post',
    params
  })
}

export const storeCinemaMovie = params => {
  return axios({
    url: '/cinema_movie',
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
  getSeatByMac,
  initTokenRefresher,
  refreshToken,
  removeTokenRefresher,
  getNewMoviesCount,
  getPlayingSeats,
  storePlayRecord,
  updatePlayRecord,
  storeCinemaMovie
}
