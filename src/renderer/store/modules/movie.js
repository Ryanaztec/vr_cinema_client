import API from '../.././service/api'
import downloader from '../../download-movies/index.js'
const _ = require('lodash')

const state = {
  cinemaMovies: [],
  allMovies: [],
  downloadingMovies: []
}

const mutations = {
  SET_CINEMA_MOVIES: (state, movies) => {
    state.cinemaMovies = movies
  },
  SET_ALL_MOVIES: (state, movies) => {
    state.allMovies = movies
  },
  SET_DOWNLOADING_MOVIES: (state, movie) => {
    state.downloadingMovies.push(movie)
  },
  UPDATE_DOWNLOADING_MOVIES: (state, movie) => {
    state.downloadingMovies.forEach((value, key) => {
      if (value.movie_id === movie.movie_id) {
        state.downloadingMovies.splice(key, 1)
      }
    })
    state.downloadingMovies.push(movie)
  },
  REMOVE_DOWNLOADING_MOVIES: (state, movie) => {
    state.downloadingMovies.forEach((value, key) => {
      if (value.movie_id === movie.movie_id) {
        state.downloadingMovies.splice(key, 1)
      }
    })
  }
}

const actions = {
  GetMovies (store, info) {
    if (!store.getters.hasLogin) {
      return false
    }
    let moviePic = ''
    return API.getMovie(info).then(response => {
      let movies = []
      response.data.data.forEach((value, key) => {
        if (value.movie.pictures[0]) {
          moviePic = value.movie.pictures.length > 0 ? value.movie.pictures[0].path : ''
        }
        let buffer = []
        let handler = function (value) {
          return value.length === 1 ? ('0' + value) : value
        }
        if (parseInt(value.movie.running_time_hour) || parseInt(value.movie.running_time_hour) === 0) {
          buffer.push(handler(value.movie.running_time_hour))
        }
        if (parseInt(value.movie.running_time_minute) || parseInt(value.movie.running_time_hour) === 0) {
          buffer.push(handler(value.movie.running_time_minute))
        }
        if (parseInt(value.movie.running_time_second)) {
          buffer.push(handler(value.movie.running_time_second))
        }
        movies.push({
          movie_name: value.movie.name,
          movie_time: buffer.join(':'),
          movie_pic: moviePic,
          movie_id: value.movie_id
        })
      })
      store.commit('SET_CINEMA_MOVIES', response.data.data)
      return {data: movies, page: response.data.page}
    })
  },
  downloadMovie (store, data) {
    const dl = downloader.initDownloader(data.movie_url, data.file_name)
    let intervalId = ''
    dl.start()
    dl.on('start', (dl) => {
      clearInterval(intervalId)
      console.log('start downloading...')
      intervalId = setInterval(() => {
        let stats = dl.getStats()
        let movie = data
        movie.stats = stats
        movie = _.cloneDeep(movie)
        store.commit('UPDATE_DOWNLOADING_MOVIES', movie)
        console.log(stats.total)
      }, 1000)
    })
    dl.on('error', (dl) => {
      clearInterval(intervalId)
      store.commit('REMOVE_DOWNLOADING_MOVIES', data)
      console.log('error', dl)
    })
    dl.on('end', (dl) => {
      clearInterval(intervalId)
      API.storeCinemaMovie({
        cinema_id: data.cinema_id,
        movie_id: data.movie_id,
        seat_id: data.seat_id
      }).then(response => {
        if (response.success) {
          store.commit('REMOVE_DOWNLOADING_MOVIES', data)
        }
      })
      // 解压缩
      const AdmZip = require('adm-zip')
      var unzip = new AdmZip('./downloaded-movies/' + data.file_name)
      unzip.extractAllTo('C:\\MOVIE', true)
      console.log('end', dl)
    })
  }
}

export default {
  actions,
  mutations,
  state
}
