import Chaos      from '../lib'
import contractor from 'truffle-contract'
import EthCrypto  from 'eth-crypto'
import Web3       from 'web3'
import fs         from 'fs'
import path       from 'path'
import chai       from 'chai'

import 'chai/register-should'
chai.use(require('dirty-chai'))
chai.use(require('chai-as-promised'))

const expect        = chai.expect
const ChaosContract = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
const web3          = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

const initialize = async () => {
  const accounts    = web3.eth.accounts
  const abstraction = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))

  abstraction.setProvider(web3.currentProvider)

  const contract = await ChaosContract.new({ from: accounts[0] })
  const chaos    = new Chaos({ ethereum: 'http://localhost:8545', address: contract.address })

  await chaos.contract.initialize({ from: accounts[0], gas: 0xffffffff })

  return chaos
}

describe('Chaos', () => {
  let accounts, admin, machine, user, contract

  before(async () => {
    accounts = web3.eth.accounts
    admin    = accounts[0]
    machine  = accounts[1]
    user     = accounts[2]

    ChaosContract.setProvider(web3.currentProvider)
    ChaosContract.defaults({ gas: 0xffffff })

    contract = await ChaosContract.new({ from: admin, gas: 0xffffff })
  })

  describe('#new', () => {
    it('should initialize object correctly', async () => {
      const chaos_1 = new Chaos()
      const chaos_2 = new Chaos({ ethereum: 'http://localhost:8545', address: contract.address })

      chaos_1.ipfs.should.exist()
      chaos_2.ipfs.should.exist()
      chaos_1.provider.host.should.equal('https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09')
      chaos_2.provider.host.should.equal('http://localhost:8545')
      chaos_1.abstraction.currentProvider.host.should.equal('https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09')
      chaos_2.abstraction.currentProvider.host.should.equal('http://localhost:8545')
      chaos_1.contract.address.should.equal('0x7e8dcb7432b8356635f2820b8e92fa6d760609fe')
      chaos_2.contract.address.should.equal(contract.address)
    })
  })

  describe('#generateToken', () => {
    it('should generate a valid token', async () => {
      const chaos = await initialize()
      const token = chaos.generateToken()

      web3.isAddress(token.address).should.be.true()
    })
  })

  describe('#registerToken', () => {
    let chaos, token

    before(async () => {
      chaos = await initialize()
      token = chaos.generateToken()
      await chaos.contract.grantMachine(machine, { from: admin })
    })

    it('should register token correctly', async () => {
      await chaos.registerToken(token.address, { from: machine })
      const granted = await chaos.contract.hasRole(token.address, 'token')

      granted.should.be.true()
    })
  })

  describe('#uploadTrack', () => {
    it('should upload track to IPFS correctly', async () => {
      const chaos  = await initialize()
      const buffer = fs.readFileSync(path.join('test', 'mocks', 'mocks.txt'))
      const hash   = await chaos.uploadTrack(buffer)

      hash.should.equal('QmNNTv7spCGrKV4BxyE2PFdwYW7SGTat1crJ5iV3x5HVKD')
    })
  })

  describe('#registerTrack', () => {
    let chaos, token

    before(async () => {
      chaos = await initialize()
      token = chaos.generateToken()
      await chaos.contract.grantMachine(machine, { from: admin })
      await chaos.registerToken(token.address, { from: machine })
    })

    it('should register track correctly', async () => {
      await chaos.registerTrack('QmNNTv7spCGrKV4BxyE2PFdwYW7SGTat1crJ5iV3x5HVKD', token.privateKey, { from: user })
      const track = await chaos.contract.tracks(0)

      track[0].should.equal(user)
      track[1].should.equal('QmNNTv7spCGrKV4BxyE2PFdwYW7SGTat1crJ5iV3x5HVKD')
    })
  })

  describe('#watch', () => {
    let chaos

    before(async () => {
      chaos = await initialize()
      await chaos.contract.grantMachine(machine, { from: admin })
    })

    it("should fetch 'TokenGranted' events correctly", (done) => {
      const token = chaos.generateToken()

      chaos.watch((err, result) => {
        if(err) {
          done(err)
        } else {
          result.args.machine.should.equal(machine)
          result.args.token.should.equal(token.address.toLowerCase())
        }
        done()
      })

      chaos.registerToken(token.address, { from: machine })
    })
  })
})
