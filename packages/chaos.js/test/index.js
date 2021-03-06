import fs         from 'fs'
import os         from 'os'
import path       from 'path'
import EthCrypto  from 'eth-crypto'
import Web3       from 'web3'
import contractor from 'truffle-contract'
import chai       from 'chai'
import { Client,  Machine } from '../lib'

import 'chai/register-should'
chai.use(require('dirty-chai'))

const ChaosContract = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
const web3          = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

describe('ChaosMachine', () => {
  let accounts, addr_admin, addr_machine, addr_user, contract

  before(async () => {
    accounts     = web3.eth.accounts
    addr_machine = accounts[0]
    addr_admin   = accounts[1]
    addr_user    = accounts[2]

    ChaosContract.setProvider(web3.currentProvider)
    ChaosContract.defaults({ gas: 0xffffff })

    contract = await ChaosContract.new({ from: addr_admin, gas: 0xffffff })
    await contract.grantMachine(addr_machine, { from: addr_admin })
  })

  describe('Client', () => {
    describe('#new', () => {
      it('should initialize client correctly', async () => {
        const client_1 = new Client()
        const client_2 = new Client({
          provider: new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09"),
          contract: contract.address
        })

        client_1.ipfs.should.exist()
        client_2.ipfs.should.exist()
        client_1.provider.host.should.equal('http://localhost:8545')
        client_2.provider.host.should.equal('https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09')
        client_1.abstraction.currentProvider.host.should.equal('http://localhost:8545')
        client_2.abstraction.currentProvider.host.should.equal('https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09')
        client_1.contract.address.should.equal(Client.defaults.contract)
        client_2.contract.address.should.equal(contract.address)
        client_1.track.client.should.deep.equal(client_1)
        client_2.track.client.should.deep.equal(client_2)
      })
    })
    describe('Track', () => {
      describe('#upload', () => {
        it('should upload track to IPFS correctly', async () => {
          const client = new Client({ contract: contract.address })
          const buffer = fs.readFileSync(path.join('test', 'fixtures', 'test.md'))
          const hash   = await client.track.upload(buffer)

          hash.should.equal('QmdQeBGRZg2SwfJyAs1Vv5iwZHAr1qdWVRANPChATg6eaH')
        })
      })
      describe('#register', () => {
        let token

        before(async () => {
          token = EthCrypto.createIdentity()
          const estimate = await contract.grantToken.estimateGas(token.address)
          const receipt  = await contract.grantToken(token.address, { from: addr_machine, gas: 2 * estimate })
        })

        it('should register track correctly', async () => {
          const client = new Client({ contract: contract.address })
          await client.track.register('QmdQeBGRZg2SwfJyAs1Vv5iwZHAr1qdWVRANPChATg6eaH', token.privateKey, { from: addr_user })
          const track = await client.contract.tracks(0)

          track[0].should.equal(addr_user)
          track[1].should.equal('QmdQeBGRZg2SwfJyAs1Vv5iwZHAr1qdWVRANPChATg6eaH')
        })
      })
    })
  })

  describe('Machine', () => {
    describe('#new', () => {
      it('should initialize machine correctly', async () => {
        const machine_1 = new Machine()
        const machine_2 = new Machine({ ethereum: 'http://localhost:8546', contract: contract.address })

        machine_1.ipfs.should.exist()
        machine_2.ipfs.should.exist()
        machine_1.web3.currentProvider.host.should.equal(Machine.defaults.ethereum)
        machine_2.web3.currentProvider.host.should.equal('http://localhost:8546')
        machine_1.abstraction.currentProvider.host.should.equal(Machine.defaults.ethereum)
        machine_2.abstraction.currentProvider.host.should.equal('http://localhost:8546')
        machine_1.contract.address.should.equal('0xcdf45df24d878dd7e564a72802ba23031acfac07')
        machine_2.contract.address.should.equal(contract.address)
        machine_1.paths.root.should.equal(path.join(os.homedir(), '.chaos'))
        machine_2.paths.root.should.equal(path.join(os.homedir(), '.chaos'))
        machine_1.paths.log.should.equal(path.join(os.homedir(), '.chaos', 'log'))
        machine_2.paths.log.should.equal(path.join(os.homedir(), '.chaos', 'log'))
        machine_1.paths.tracks.should.equal(path.join(os.homedir(), '.chaos', 'tracks'))
        machine_2.paths.tracks.should.equal(path.join(os.homedir(), '.chaos', 'tracks'))
        machine_1.fs.should.exist()
        machine_1.fs.should.exist()
        machine_1.log.machine.should.deep.equal(machine_1)
        machine_2.log.machine.should.deep.equal(machine_2)
        machine_1.track.machine.should.deep.equal(machine_1)
        machine_2.track.machine.should.deep.equal(machine_2)
        machine_1.audio.machine.should.deep.equal(machine_1)
        machine_2.audio.machine.should.deep.equal(machine_2)
        machine_1.token.machine.should.deep.equal(machine_1)
        machine_2.token.machine.should.deep.equal(machine_2)
        // fs.existsSync(machine_1.paths.root).should.equal(true)
        // fs.existsSync(machine_1.paths.tracks).should.equal(true)
      })
    })
    describe('Token', () => {
      describe('#generate', () => {
        it('should generate a valid token', async () => {
          const machine = new Machine({ ethereum: 'http://localhost:8545', contract: contract.address })
          await machine.start()
          const token   = machine.token.generate()

          web3.isAddress(token.address).should.be.true()
        })
      })
      describe('#register', () => {
        it('should register token correctly', async () => {
          const machine = new Machine({ ethereum: 'http://localhost:8545', contract: contract.address })
          await machine.start()
          const token   = machine.token.generate()

          await machine.token.register(token.address)
          const granted = await machine.contract.hasRole(token.address, 'token')

          granted.should.be.true()
        })
      })
    })
  })
})
