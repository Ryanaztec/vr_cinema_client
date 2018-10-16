import API from '../.././service/api'
import Vue from 'vue'

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
      // API.initTokenRefresher(store)
    }).then(res => {
      // 获取mac地址
      store.dispatch('getMacAddress').then(response => {
        // 获取所有正在播放的座椅
        let macAddress = response
        store.dispatch('GetPlayingStatusSeats', {
          cinema_id: this.state.currentUser.cinemaId,
          mac_address: macAddress
        })
        // 获取影院所有的座椅信息
        API.getSeatByMac({
          cinema_id: this.state.currentUser.cinemaId,
          mac_address: response
        }).then((response) => {
          if (response.success) {
            store.commit('SET_SEATS', response.data.data)
            store.commit('SET_IS_MAIN', response.data.is_main_seat)
            store.commit('SET_MAIN_SEAT', response.data.main_seat)
            if (response.data.is_main_seat) {
              store.dispatch('subSeatsLogin', response.data.data)
            }
          }
        }).catch(() => {
          // 处理请求偶尔失败的情况
          Vue.notify({
            group: 'foo',
            text: '获取Mac地址失败，请重新登陆'
          })
        })
      })
    }).catch(() => {
      store.dispatch('FedLogOut')
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
