import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'vr_cinema',
      component: require('@/components/vrcinema').default
    },
    {
      path: '/cinema_resources',
      name: 'cinema_resources',
      component: require('@/components/cinemaresources').default
    },
    {
      path: '/video_detail',
      name: 'video_detail',
      component: require('@/components/videodetail').default
    }
  ]
})
