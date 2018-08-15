'use strict'

module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      network_id: '*'
    },
    mainnet: {
      host: 'localhost',
      port: 8545,
      network_id: 1,
      gasPrice: 8000000000
    }
  }
}
