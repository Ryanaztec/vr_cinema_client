const state = {
  showLoading: true
}

const mutations = {
  SET_LOADING_VISIBLE: (state, showLoading) => {
    state.showLoading = showLoading
  }
}

const actions = {
  StartLoading (store) {
    store.commit('SET_LOADING_VISIBLE', true)
  },
  StopLoading (store) {
    store.commit('SET_LOADING_VISIBLE', false)
  }
}

export default {
  state,
  actions,
  mutations
}
