'use strict'
const HDWalletProvider = require("truffle-hdwallet-provider");


module.exports = {
  networks: {
    local: {
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      network_id: '*'
    },
    mainnet: {
      provider: function() {
        const mnemonic = require('./mnemonic.js')
        return new HDWalletProvider(mnemonic, "https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09")
      },
      network_id: 1,
      gasPrice: 8000000000
    }
  }
}
