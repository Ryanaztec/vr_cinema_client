import Sender from '../../udp/sender'

const state = {
  showLoading: true,
  macAddress: '',
  ip_address: '',
  local_ip: '',
  ali_oss_signature: ''
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
  },
  SET_ALI_OSS_SIGNATURE: (state, data) => {
    state.ali_oss_signature = data
  },
  SET_LOCAL_IP: (state, data) => {
    state.local_ip = data
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
      var interfaces = require('os').networkInterfaces()
      for (var i in interfaces) {
        if (interfaces.hasOwnProperty(i)) {
          interfaces[i].map(function mapInterface (intface) {
            if (intface.family === 'IPv4' && !intface.internal) {
              store.commit('SET_MAC_ADDRESS', intface.mac)
              store.commit('SET_LOCAL_IP', intface.address)
              resolve(intface.mac)
            }
          })
        }
      }
    })
  },
  subSeatsLogin (store, seats) {
    const token = localStorage.token
    let message = { token: token, type: 'login' }
    message = JSON.stringify(message)
    // 依此发送消息
    seats.forEach((value, key) => {
      Sender.sendMessage(message, value.ip_address, true)
    })
  },
  subSeatsLogout (store, seats) {
    let message = { type: 'logout' }
    message = JSON.stringify(message)
    // 依此发送消息
    seats.forEach((value, key) => {
      Sender.sendMessage(message, value.ip_address, true)
    })
  }
}

export default {
  state,
  actions,
  mutations
}
