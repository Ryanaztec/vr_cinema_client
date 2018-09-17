import router from './router'
import store from './store'

router.beforeEach((to, from, next) => {
  if (localStorage.token && localStorage.token.length !== 0) {
    store.commit('SET_TOKEN', localStorage.token)
    if (store.state.currentUser.username.length === 0) {
      store.dispatch('GetInfo')
        .then(res => {
          store.dispatch('getMacAddress').then(response => {
            store.dispatch('GetPlayingStatusSeats', {
              cinema_id: store.state.currentUser.cinemaId,
              mac_address: response
            })
          })
          next()
        })
        .catch(() => {
          store.dispatch('FedLogOut').then(() => {
            router.push({ path: '/' })
          })
        })
    } else {
      next()
    }
  } else {
    next()
  }
})
