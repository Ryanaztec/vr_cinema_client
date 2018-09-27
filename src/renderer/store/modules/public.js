import Sender from '../../udp/sender'

const state = {
  showLoading: true,
  macAddress: '',
  ip_address: ''
}

const mutations = {
  SET_LOADING_VISIBLE: (state, showLoading) => {
    state.showLoading = showLoading
  },
  SET_MAC_ADDRESS: (state, macAddress) => {
    state.macAddress = macAddress
  },
  SET_IP_ADDRESS: (state, ip) => {
    state.ip_address = ip
  }
}

const actions = {
  StartLoading (store) {
    store.commit('SET_LOADING_VISIBLE', true)
  },
  StopLoading (store) {
    store.commit('SET_LOADING_VISIBLE', false)
  },
  async getMacAddress (store) {
    return new Promise(function (resolve, reject) {
      require('getmac').getMac(function (err, macAddress) {
        if (err) {
          reject(err)
        } else {
          resolve(macAddress)
        }
      })
    })
  },
  subSeatsLogin (store, seats) {
    const token = localStorage.token
    let ips = []
    let message = { token: token, type: 'login' }
    message = JSON.stringify(message)
    seats.forEach((value, key) => {
      ips.push(value.ip_address)
    })
    Sender.sendMessage(message, ips, true)
  },
  subSeatsLogout (store, seats) {
    let ips = []
    let message = { type: 'logout' }
    message = JSON.stringify(message)
    seats.forEach((value, key) => {
      ips.push(value.ip_address)
    })
    Sender.sendMessage(message, ips, true)
  }
}

export default {
  state,
  actions,
  mutations
}
