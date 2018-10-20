import router from './router'
import store from './store'
// import API from './service/api'

router.beforeEach((to, from, next) => {
  if (localStorage.token && localStorage.token.length !== 0) {
    store.commit('SET_TOKEN', localStorage.token)
    if (store.state.currentUser.username.length === 0) {
      // 用token拿用户信息
      store.dispatch('GetInfo')
      // API.getOssSignature().then(response => {
      //   store.commit('SET_ALI_OSS_SIGNATURE', response.data)
      // })
      next()
    } else {
      next()
    }
  } else {
    next()
  }
})
