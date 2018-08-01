'use strict'

require('babel-register')
require('babel-polyfill')

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      network_id: '*'
    }
  }
}
