import fs         from 'fs'
import os         from 'os'
import path       from 'path'
import EthCrypto  from 'eth-crypto'
import Web3       from 'web3'
import contractor from 'truffle-contract'
import chai       from 'chai'
import Client     from '../lib'

import 'chai/register-should'
chai.use(require('dirty-chai'))

const ChaosContract = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
const web3          = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

describe('ChaosMachine', () => {
  let accounts, addr_machine, addr_admin, addr_user, contract

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
})
