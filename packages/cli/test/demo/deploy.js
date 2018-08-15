import fs         from 'fs'
import path       from 'path'
import Web3       from 'web3'
import contractor from 'truffle-contract'
import { Client, Machine } from '@chaosmachine/chaos.js'
import { token_1, token_2, token_3 } from './data'

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
  await contract.grantMachine(addr_machine, { from: addr_admin })

  console.log('[address:' + contract.address + ']')
  fs.writeFileSync(path.join('test', 'demo', 'address.txt'), contract.address)
  console.log('[address:saved]')

  const chaos   = new Client({ address: contract.address })
  const machine = await Machine.launch({ ethereum: 'http://localhost:8545', address: contract.address })

  await machine.token.register(token_1.address)
  await machine.token.register(token_2.address)
  await machine.token.register(token_3.address)
  console.log('[tokens:registered]')

  await chaos.track.register(tracks[0], token_1.privateKey, { from: addr_user })
  await chaos.track.register(tracks[1], token_2.privateKey, { from: addr_user })
  await chaos.track.register(tracks[2], token_3.privateKey, { from: addr_user })
  console.log('[tracks:registered]')

  process.exit(0)
}

main()
