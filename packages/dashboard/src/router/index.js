import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../components/Welcome.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    }
    // {
    //   path: '/ipfs',
    //   name: 'ipfs',
    //   component: DashboardIPFS
    // }
  ]
})
