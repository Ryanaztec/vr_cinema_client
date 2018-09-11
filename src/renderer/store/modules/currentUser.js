import API from '../.././service/api'

const state = {
  username: '',
  token: '',
  isLogin: false,
  cinemaId: ''
}

const mutations = {
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_IS_LOGIN: (state, status) => {
    state.isLogin = status
  },
  SET_CINEMA_ID: (state, id) => {
    state.cinemaId = id
  }
}

const getters = {
  hasLogin: (state) => {
    return localStorage.token && localStorage.token.length > 0
  }
}

const actions = {
  Login (store, userInfo) {
    const username = userInfo.username.trim()
    return API.login({username: username, password: userInfo.password, isClient: true}).then(response => {
      localStorage.token = response.token
      store.commit('SET_TOKEN', response.token)
      store.dispatch('GetInfo')
    }).catch(error => {
      throw error
    })
  },
  GetInfo (store) {
    return API.getInfo(localStorage.token).then(response => {
      const data = response.data
      store.commit('SET_USERNAME', data.username)
      store.commit('SET_CINEMA_ID', data.cinema.id)
      store.commit('SET_IS_LOGIN', true)
    }).catch(error => {
      throw error
    })
  },
  FedLogOut (store) {
    localStorage.removeItem('token')
    store.commit('SET_TOKEN', '')
    store.commit('SET_USERNAME', '')
    store.commit('SET_IS_LOGIN', false)
  },
  GetMovies (store, info) {
    if (!store.state.isLogin) {
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
        if (parseInt(value.movie.running_time_hour)) {
          buffer.push(value.movie.running_time_hour)
        }
        if (parseInt(value.movie.running_time_minute)) {
          buffer.push(handler(value.movie.running_time_minute))
        }
        if (parseInt(value.movie.running_time_second)) {
          buffer.push(handler(value.movie.running_time_second))
        }
        movies.push({
          movie_name: value.movie.name,
          movie_time: buffer.join(':'),
          movie_pic: moviePic
        })
      })
      return {data: movies, page: response.data.page}
    })
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
