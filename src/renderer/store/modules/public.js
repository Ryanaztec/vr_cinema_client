const state = {
  showLoading: true,
  macAddress: ''
}

const mutations = {
  SET_LOADING_VISIBLE: (state, showLoading) => {
    state.showLoading = showLoading
  },
  SET_MAC_ADDRESS: (state, macAddress) => {
    state.macAddress = macAddress
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
  }
}

export default {
  state,
  actions,
  mutations
}
