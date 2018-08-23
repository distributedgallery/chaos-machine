import fs         from 'fs'
import path       from 'path'
import Web3       from 'web3'
import contractor from 'truffle-contract'
import { Machine } from '@chaosmachine/chaos.js'
import { token_4, token_5, token_6 } from './data'

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const tracks = [
  'Qmb9WN3XqP1Ybk9ASZDRd2vq3Nw73oDXMKJP7J4S8t6S3p',
  'Qmb4wKfJv2NuN8DGouMpgYARKZNW5L8YjkofM2iBXrA32U',
  'QmQ4kZpt8VNvQJLEZQcYtU37sfrbAHcdpWtfakbYCYkjeH'
]

const main = async () => {
  const ChaosContract = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
  const web3          = new Web3(new Web3.providers.HttpProvider("http://213.239.214.80:30303"))
  const accounts      = web3.eth.accounts

  console.log(accounts)


//   const machine = await Machine.launch({ ethereum: 'http://192.168.0.11:8545' })
//   //
//   console.log('Registering token')
//   await machine.token.register(token_4.address, { from: '0x69F795c531Ccc33e821780ccf4cDcDE248D5b31e'})
//   console.log('Token registered')
//   process.exit(0)
}

main()
