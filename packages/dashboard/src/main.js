import Vue           from 'vue'
import Vuex          from 'vuex'
import App           from './App.vue'
import Notifications from 'vue-notification'
import router        from './router/index'
import store         from './store'
import Particles     from 'particlesjs'

Vue.use(Vuex)
Vue.use(Notifications)

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
        maxParticles: 300,
        connectParticles: true,
        responsive:
            [{
                breakpoint: 1024,
                options: { maxParticles: 200 }
            },
            {   breakpoint: 680,
                options: { maxParticles: 100 }

            },
            {
                breakpoint: 320,
                options: { maxParticles: 0 }
            }]
    })
    store.commit('init')
})
