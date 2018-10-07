import router from './router'
import store from './store'

router.beforeEach((to, from, next) => {
  if (localStorage.token && localStorage.token.length !== 0) {
    store.commit('SET_TOKEN', localStorage.token)
    if (store.state.currentUser.username.length === 0) {
      // 用token拿用户信息
      store.dispatch('GetInfo')
      next()
    } else {
      next()
    }
  } else {
    next()
  }
})
