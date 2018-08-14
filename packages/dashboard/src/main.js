import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import Notifications from 'vue-notification'

import router from './router/index'
import store from './store'
// import VueParticles from 'vue-particles'
import Particles from 'particlesjs'
// npm install particlesjs --save

Vue.use(Vuex)
Vue.use(Notifications)
// Vue.use(VueParticles)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

window.addEventListener('load', () => {
  Particles.init({
    selector: '.particles',
    color: '#666666',
    maxParticles: 450,
    connectParticles: true
  })
  store.commit('init')
})
