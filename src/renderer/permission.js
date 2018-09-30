import router from './router'
import store from './store'
import API from './service/api.js'

router.beforeEach((to, from, next) => {
  if (localStorage.token && localStorage.token.length !== 0) {
    store.commit('SET_TOKEN', localStorage.token)
    if (store.state.currentUser.username.length === 0) {
      // 用token拿用户信息
      store.dispatch('GetInfo')
        .then(res => {
          // 获取mac地址
          store.dispatch('getMacAddress').then(response => {
            // 获取所有正在播放的座椅
            store.dispatch('GetPlayingStatusSeats', {
              cinema_id: store.state.currentUser.cinemaId,
              mac_address: response
            })
            // 获取影院所有的座椅信息
            API.getSeatByMac({
              cinema_id: store.state.currentUser.cinemaId,
              mac_address: response
            }).then((response) => {
              console.log(response)
              if (response.success) {
                store.commit('SET_SEATS', response.data.data)
                store.commit('SET_IS_MAIN', response.data.is_main_seat)
                store.commit('SET_MAIN_SEAT', response.data.main_seat)
              }
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
