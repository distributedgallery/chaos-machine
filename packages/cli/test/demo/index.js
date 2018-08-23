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
  // const web3          = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"))
  // const accounts      = web3.eth.accounts
  // const addr_machine  = accounts[0]
  // const addr_admin    = accounts[1]

  const address = fs.readFileSync(path.join('test', 'demo', 'address.txt'), 'utf8')

  ChaosContract.setProvider(web3.currentProvider)

  // const contract = await ChaosContract.at(address)

  // await contract.grantMachine(addr_machine, { from: addr_admin })

  // const machine = await Machine.launch({ ethereum: 'http://localhost:8545', address: contract.address })
  const machine = await Machine.launch()

  await machine.token.register(token_4.address)
  await timeout(50000)
  await machine.token.register(token_5.address)
  await timeout(50000)
  await machine.token.register(token_6.address)
}

main()
