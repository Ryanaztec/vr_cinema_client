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
      path: '*',
      redirect: '/'
    }
  ]
})
