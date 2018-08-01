// import Vue from 'vue'
// import App from './App.vue'
//
// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   template: '<App/>',
//   components: { App }
// })

import Vue from 'vue'
import App from './App.vue'
import router from './router/index'

// new Vue({
//   el: '#app',
//   render: h => h(App)
// })

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

// export function createApp() {
//   const app = new Vue({
//     el: '#app',
//     router,
//     render: h => h(App),
//     components: { app }
//   })
//
//   // expose the app and the router
//   // return { app, router }
// }
//
// window.onload = () => {
//   new Vue({
//     el: '#app',
//     router,
//     render: h => h(App),
//     components: { App }
//   })
// }
