import Vue from 'vue'
import Router from 'vue-router'
import Welcome from '../components/Welcome.vue'
import Authenticate from '../components/Authenticate.vue'
import Upload from '../components/Upload.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: Welcome
    },
    {
      path: '/authenticate',
      name: 'authenticate',
      component: Authenticate
    },
    {
      path: '/upload',
      name: 'upload',
      component: Upload
    }
  ]
})
