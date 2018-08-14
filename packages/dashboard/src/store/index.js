import Vue from 'vue'
import Vuex from 'vuex'
import Web3 from 'web3'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    web3: false,
    network: undefined,
    account: undefined
  },
  mutations: {
    init(state) {
      if (typeof web3 !== 'undefined') {
        window.web3 = new Web3(web3.currentProvider)
        state.web3 = true
        state.network = window.web3.version.network
        state.account = window.web3.eth.accounts[0]
      } else {
        state.web3 = false
        state.network = undefined
        state.account = undefined
      }
    }
  }
})

export default store
