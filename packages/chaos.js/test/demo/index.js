import fs         from 'fs'
import path       from 'path'
import Web3       from 'web3'
import contractor from 'truffle-contract'
import { Client, Machine } from '../../lib/'
import { token_1, token_2, token_3, token_4, token_5, token_6, token_7 } from './data'

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
  const web3          = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
  const accounts      = web3.eth.accounts
  const addr_admin    = accounts[1]
  const addr_machine  = accounts[0]
  const addr_user     = accounts[2]

  ChaosContract.setProvider(web3.currentProvider)

  const contract = await ChaosContract.new({ from: addr_admin, gas: 0xffffffff })
  await contract.initialize({ from: addr_admin, gas: 0xffffffff })
  await contract.grantMachine(addr_machine, { from: addr_admin })

  const chaos   = new Client({ address: contract.address })
  const machine = await Machine.launch({ ethereum: 'http://localhost:8545', address: contract.address })

  // const buffer = fs.readFileSync(path.join('test', 'mocks', 'fixtures', 'agar.mp3'))
  // const hash = await chaos.track.upload(buffer)
  // console.log(hash)

  await machine.token.register(token_1.address)
  await machine.token.register(token_2.address)
  await machine.token.register(token_3.address)

  await chaos.track.register(tracks[0], token_1.privateKey, { from: addr_user })
  await chaos.track.register(tracks[1], token_2.privateKey, { from: addr_user })
  await chaos.track.register(tracks[2], token_3.privateKey, { from: addr_user })

  await timeout(10000)
  await machine.token.register(token_4.address)
  await timeout(10000)
  await machine.token.register(token_5.address)
  await timeout(10000)
  await machine.token.register(token_6.address)
}

main()
