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
      API.initTokenRefresher(store)
    }).catch(error => {
      throw error
    })
  },
  FedLogOut (store) {
    localStorage.removeItem('token')
    store.commit('SET_TOKEN', '')
    store.commit('SET_USERNAME', '')
    store.commit('SET_IS_LOGIN', false)
    store.commit('SET_SEATS', [])
    store.commit('SET_MAIN_SEAT', false)
    store.commit('SET_CINEMA_ID', '')
    store.commit('SET_PLAYING_SEATS', [])
  },
  // 刷新 Token
  async RefreshToken ({ commit, store }) {
    try {
      const response = await API.refreshToken()
      localStorage.token = response.token
      commit('SET_TOKEN', response.token)
      return response
    } catch (e) {
      throw e
    }
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
