import ChaosMachine from '../lib/machine'
import contractor   from 'truffle-contract'
import Web3         from 'web3'
import chai         from 'chai'

import 'chai/register-should'
chai.use(require('dirty-chai'))

const ChaosContract = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
const web3          = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

describe('ChaosMachine', () => {
  let accounts, admin, chaos, contract

  before(async () => {
    accounts = web3.eth.accounts
    chaos    = accounts[0]
    admin    = accounts[1]

    ChaosContract.setProvider(web3.currentProvider)
    ChaosContract.defaults({ gas: 0xffffff })

    contract = await ChaosContract.new({ from: admin, gas: 0xffffff })
    await contract.initialize({ from: admin, gas: 0xffffffff })
    await contract.grantMachine(chaos, { from: admin })
  })

  describe('#create', () => {
    it('should initialize object correctly', async () => {
      const machine_1 = await ChaosMachine.create()
      const machine_2 = await ChaosMachine.create({ ethereum: 'http://localhost:8545', address: contract.address, mnemonic: 'adjust body try car bulk update primary degree toe juice output like' })

      machine_1.ipfs.should.exist()
      machine_2.ipfs.should.exist()
      machine_1.provider.engine._providers[2].provider.host.should.equal('https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09')
      machine_2.provider.engine._providers[2].provider.host.should.equal('http://localhost:8545')
      machine_1.abstraction.currentProvider.engine._providers[2].provider.host.should.equal('https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09')
      machine_2.abstraction.currentProvider.engine._providers[2].provider.host.should.equal('http://localhost:8545')
      machine_1.contract.address.should.equal('0x7e8dcb7432b8356635f2820b8e92fa6d760609fe')
      machine_2.contract.address.should.equal(contract.address)
      machine_1.mnemonic.should.equal('journey nice rather ball theme used uncover gate pond rifle between state')
      machine_2.mnemonic.should.equal('adjust body try car bulk update primary degree toe juice output like')
    })
  })

  describe('#generateToken', () => {
    it('should generate a valid token', async () => {
      const machine = await ChaosMachine.create({ ethereum: 'http://localhost:8545', address: contract.address })
      const token   = machine.generateToken()

      web3.isAddress(token.address).should.be.true()
    })
  })

  describe('#registerToken', () => {
    it('should register token correctly', async () => {
      const machine = await ChaosMachine.create({ ethereum: 'http://localhost:8545', address: contract.address })
      const token   = machine.generateToken()

      await machine.registerToken(token.address)
      const granted = await machine.contract.hasRole(token.address, 'token')

      granted.should.be.true()
    })
  })

  describe('#events', () => {
    let machine, token

    before(async () => {
      machine = await ChaosMachine.create({ ethereum: 'http://localhost:8545', address: contract.address })
      token   = machine.generateToken()
      await machine.registerToken(token.address)
    })

    it("should fetch 'TokenGranted' events correctly", (done) => {
      machine.on('tokenGranted', (result) => {
        result.args.machine.should.equal(chaos)
        result.args.token.should.equal(token.address.toLowerCase())
        done()
      })
    })
  })
})
