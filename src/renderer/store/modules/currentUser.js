import API from '../.././service/api'

const state = {
  username: ''
}

const mutations = {
  SET_USERNAME: (state, username) => {
    state.username = username
  }
}

const actions = {
  Login (store, userInfo) {
    const username = userInfo.username.trim()
    return API.login({username: username, password: userInfo.password}).then(response => {
      const data = response
      localStorage.token = data.token
      return data
    }).catch(error => {
      throw error
    })
  }
}

export default {
  state,
  actions,
  mutations
}
