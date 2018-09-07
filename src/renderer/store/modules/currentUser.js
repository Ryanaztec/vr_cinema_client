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
    return API.login({username: username, password: userInfo.password}).then(response => {
      localStorage.token = response.token
      store.commit('SET_TOKEN', response.token)
      store.dispatch('GetInfo')
    }).catch(error => {
      console.log(error)
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
  },
  GetMovies (store, info) {
    let moviePic = ''
    return API.getMovie(info).then(response => {
      let movies = []
      response.data.forEach((value, key) => {
        if (value.pictures.is_main === 1) {
          moviePic = value.pictures.path
        }
        movies.push({
          movie_name: value.name,
          movie_time: value.running_time,
          movie_pic: moviePic
        })
      })
      return movies
    })
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
