const Chaos = artifacts.require('ChaosMachine')
const { TestApp } = require('zos')
const EthCrypto = require('eth-crypto')

const { assertRevert } = require('./helpers/assertRevert')
const expectEvent = require('./helpers/expectEvent')

contract('ChaosMachine', function(accounts) {
  let app, chaos
  let bouncer_1, bouncer_2

  const admin = accounts[0]
  const unauthorized = accounts[5]

  const machine_1 = accounts[8]
  const machine_2 = accounts[9]

  const user_1 = accounts[1]
  const user_2 = accounts[2]

  before(async () => {
    app = await TestApp(null, { from: admin })
    chaos = await app.createProxy(Chaos)
  })

  context('#initialize', () => {
    it('should initialize contract correctly', async function() {
      await chaos.initialize({ from: admin })
    })

    it('should grant admin role to initializer', async function() {
      assert.equal(await chaos.hasRole(admin, 'admin'), true)
    })

    it('should revert when called more than once', async function() {
      await assertRevert(chaos.initialize({ from: admin }))
    })
  })

  context('Machine', () => {
    context('#grantMachine', () => {
      it('should grant machine role correctly when called from admin account', async function() {
        await chaos.grantMachine(machine_1, { from: admin })
        assert.equal(await chaos.hasRole(machine_1, 'machine'), true)
        assert.equal(await chaos.hasRole(machine_2, 'machine'), false)
      })

      it('should revert when not called from admin account', async function() {
        await assertRevert(
          chaos.grantMachine(machine_2, { from: unauthorized })
        )
        assert.equal(await chaos.hasRole(machine_2, 'machine'), false)
      })
    })

    context('#revokeMachine', () => {
      it('should revoke machine role correctly when called from admin account', async function() {
        await chaos.revokeMachine(machine_1, { from: admin })
        assert.equal(await chaos.hasRole(machine_1, 'machine'), false)
      })

      it('should revert when not called from admin account', async function() {
        await chaos.grantMachine(machine_1, { from: admin })
        await assertRevert(
          chaos.grantMachine(machine_2, { from: unauthorized })
        )
        assert.equal(await chaos.hasRole(machine_1, 'machine'), true)
      })
    })
  })

  context('Bouncer', () => {
    let bouncer_1, bouncer_2

    before(async () => {
      app = await TestApp(null, { from: admin })
      chaos = await app.createProxy(Chaos)

      await chaos.initialize({ from: admin })
      await chaos.grantMachine(machine_1, { from: admin })
      await chaos.grantMachine(machine_2, { from: admin })

      bouncer_1 = EthCrypto.createIdentity()
      bouncer_2 = EthCrypto.createIdentity()
    })

    context('#grantBouncer', () => {
      it('should grant bouncer role correctly when called from machine account', async () => {
        await chaos.grantBouncer(bouncer_1.address, { from: machine_1 })
        assert.equal(await chaos.hasRole(bouncer_1.address, 'bouncer'), true)
      })

      it('should revert when not called from machine account', async () => {
        await assertRevert(
          chaos.grantBouncer(bouncer_2.address, { from: admin })
        )
        await assertRevert(
          chaos.grantBouncer(bouncer_2.address, { from: unauthorized })
        )
        assert.equal(await chaos.hasRole(bouncer_2.address, 'bouncer'), false)
      })
    })

    context('#revokeBouncer', () => {
      it('should revoke bouncer role correctly when called from admin account', async () => {
        await chaos.revokeBouncer(bouncer_1.address, { from: admin })
        assert.equal(await chaos.hasRole(bouncer_1.address, 'bouncer'), false)
      })

      it('should revert when not called from admin account', async () => {
        await chaos.grantBouncer(bouncer_1.address, { from: machine_1 })
        await assertRevert(
          chaos.revokeBouncer(bouncer_1.address, { from: machine_1 })
        )
        await assertRevert(
          chaos.revokeBouncer(bouncer_2.address, { from: unauthorized })
        )
        assert.equal(await chaos.hasRole(bouncer_1.address, 'bouncer'), true)
      })
    })
  })

  context('User', () => {
    let bouncer_1, bouncer_2

    before(async () => {
      app = await TestApp(null, { from: admin })
      chaos = await app.createProxy(Chaos)

      await chaos.initialize({ from: admin })
      await chaos.grantMachine(machine_1, { from: admin })

      bouncer_1 = EthCrypto.createIdentity()
      bouncer_2 = EthCrypto.createIdentity()

      await chaos.grantBouncer(bouncer_1.address, { from: machine_1 })
      await chaos.grantBouncer(bouncer_2.address, { from: machine_1 })
    })

    context('#grantUser', () => {
      it('should grant user role correctly when valid signature is passed', async () => {
        const message = 'kittiesarefordummies'
        const hash = EthCrypto.hash.keccak256(message)
        const signature = EthCrypto.sign(bouncer_1.privateKey, hash)

        await chaos.grantUser(hash, signature, { from: user_1 })

        assert.equal(await chaos.hasRole(bouncer_1.address, 'bouncer'), false)
        assert.equal(await chaos.hasRole(user_1, 'user'), true)
      })
    })
  })
})
