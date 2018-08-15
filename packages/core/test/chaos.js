const Chaos = artifacts.require('Chaos')
const EthCrypto = require('eth-crypto')
const { assertRevert } = require('./helpers/assertRevert')
const expectEvent = require('./helpers/expectEvent')

contract('Chaos', function(accounts) {
  let app, chaos

  const admin = accounts[0]
  const user_1 = accounts[1]
  const user_2 = accounts[2]
  const unauthorized = accounts[5]
  const machine_1 = accounts[8]
  const machine_2 = accounts[9]

  context('Initialization', () => {
    context('#constructor', () => {
      it('should deploy contract correctly', async () => {
        chaos = await Chaos.new({ from: admin })
      })

      it("should grant 'admin' role to initializer address", async () => {
        assert.equal(await chaos.hasRole(admin, 'admin'), true)
      })

      it('should not grant any other role', async () => {
        assert.equal(await chaos.hasRole(unauthorized, 'admin'), false)
        assert.equal(await chaos.hasRole(machine_1, 'machine'), false)
        assert.equal(await chaos.hasRole(machine_2, 'machine'), false)
        assert.equal(await chaos.hasRole(user_1, 'token'), false)
      })
    })
  })

  context('Admins', () => {
    context('#updateAdmin', () => {
      context("when called from an 'admin' account, it", () => {
        let receipt

        before(async () => {
          chaos = await Chaos.new({ from: admin })
        })

        it("should update 'admin' role correctly", async () => {
          receipt = await chaos.updateAdmin(user_1, { from: admin })
          assert.equal(await chaos.hasRole(admin, 'admin'), false)
          assert.equal(await chaos.hasRole(user_1, 'admin'), true)
        })

        it("should emit an 'AdminUpdated' event correctly", async () => {
          const event = await expectEvent.inLogs(receipt.logs, 'AdminUpdated')
          assert.equal(event.args.oldAddress, admin)
          assert.equal(event.args.newAddress, user_1)
        })
      })

      context("when not called from an 'admin' account, it", () => {
        before(async () => {
          chaos = await Chaos.new({ from: admin })
        })

        it('should revert', async () => {
          await assertRevert(chaos.updateAdmin(user_1, { from: unauthorized }))
          assert.equal(await chaos.hasRole(admin, 'admin'), true)
          assert.equal(await chaos.hasRole(user_1, 'admin'), false)
        })
      })
    })
  })

  context('Machines', () => {
    context('#grantMachine', () => {
      context("when called from an 'admin' account, it", () => {
        let receipt

        before(async () => {
          chaos = await Chaos.new({ from: admin })
        })

        it("should grant 'machine' role correctly", async () => {
          receipt = await chaos.grantMachine(machine_1, { from: admin })
          assert.equal(await chaos.hasRole(machine_1, 'machine'), true)
        })

        it("should emit a 'MachineGranted' event correctly", async () => {
          const event = await expectEvent.inLogs(receipt.logs, 'MachineGranted')
          assert.equal(event.args.machine, machine_1)
        })
      })

      context("when not called from an 'admin' account, it", () => {
        before(async () => {
          chaos = await Chaos.new({ from: admin })
        })

        it('should revert', async () => {
          await assertRevert(
            chaos.grantMachine(machine_1, { from: unauthorized })
          )
          assert.equal(await chaos.hasRole(machine_1, 'machine'), false)
        })
      })
    })

    context('#revokeMachine', () => {
      context("when called from an 'admin' account, it", () => {
        let receipt

        before(async () => {
          chaos = await Chaos.new({ from: admin })
          await chaos.grantMachine(machine_1, { from: admin })
        })

        it("should revoke 'machine' role correctly", async () => {
          receipt = await chaos.revokeMachine(machine_1, { from: admin })
          assert.equal(await chaos.hasRole(machine_1, 'machine'), false)
        })

        it("should emit a 'MachineRevoked' event correctly", async () => {
          const event = await expectEvent.inLogs(receipt.logs, 'MachineRevoked')
          assert.equal(event.args.machine, machine_1)
        })
      })

      context("when not called from an 'admin' account, it", () => {
        before(async () => {
          chaos = await Chaos.new({ from: admin })
          await chaos.grantMachine(machine_1, { from: admin })
        })

        it('should revert', async () => {
          await assertRevert(
            chaos.revokeMachine(machine_1, { from: unauthorized })
          )
          assert.equal(await chaos.hasRole(machine_1, 'machine'), true)
        })
      })
    })
  })

  context('Tokens', () => {
    context('#grantToken', () => {
      context("when called from an authorized 'machine' account, it", () => {
        let receipt, token

        before(async () => {
          chaos = await Chaos.new({ from: admin })

          await chaos.grantMachine(machine_1, { from: admin })

          token = EthCrypto.createIdentity()
        })

        it("should grant 'token' role correctly", async () => {
          receipt = await chaos.grantToken(token.address, { from: machine_1 })
          assert.equal(await chaos.hasRole(token.address, 'token'), true)
        })

        it("should emit a 'TokenGranted' event correctly", async () => {
          const event = await expectEvent.inLogs(receipt.logs, 'TokenGranted')
          assert.equal(event.args.token, token.address.toLowerCase())
          assert.equal(event.args.machine, machine_1)
        })
      })

      context(
        "when not called from an authorized 'machine' account, it",
        () => {
          let token

          before(async () => {
            chaos = await Chaos.new({ from: admin })

            await chaos.grantMachine(machine_1, { from: admin })

            token = EthCrypto.createIdentity()
          })

          it('should revert', async () => {
            await assertRevert(chaos.grantToken(token.address, { from: admin }))
            await assertRevert(
              chaos.grantToken(token.address, { from: unauthorized })
            )
            assert.equal(await chaos.hasRole(token.address, 'token'), false)
          })
        }
      )
    })

    context('#revokeToken', () => {
      context("when called from an 'admin' account, it", () => {
        let receipt, token

        before(async () => {
          chaos = await Chaos.new({ from: admin })
          await chaos.grantMachine(machine_1, { from: admin })
          token = EthCrypto.createIdentity()
          await chaos.grantToken(token.address, { from: machine_1 })
        })

        it("should revoke 'token' role correctly", async () => {
          receipt = await chaos.revokeToken(token.address, { from: admin })
          assert.equal(await chaos.hasRole(token.address, 'token'), false)
        })

        it("should emit a 'TokenRevoked' event correctly", async () => {
          const event = await expectEvent.inLogs(receipt.logs, 'TokenRevoked')
          assert.equal(event.args.token, token.address.toLowerCase())
        })
      })

      context("when not called from an 'admin' account, it", () => {
        let token

        before(async () => {
          chaos = await Chaos.new({ from: admin })
          await chaos.grantMachine(machine_1, { from: admin })
          token = EthCrypto.createIdentity()
          await chaos.grantToken(token.address, { from: machine_1 })
        })

        it('should revert', async () => {
          await assertRevert(
            chaos.revokeToken(token.address, { from: machine_1 })
          )
          await assertRevert(
            chaos.revokeToken(token.address, { from: unauthorized })
          )
          assert.equal(await chaos.hasRole(token.address, 'token'), true)
        })
      })
    })
  })

  context('Tracks', () => {
    context('#addTrack', () => {
      context('when called with an authorized token, it', () => {
        let receipt, token

        before(async () => {
          chaos = await Chaos.new({ from: admin })

          await chaos.grantMachine(machine_1, { from: admin })

          token = EthCrypto.createIdentity()

          await chaos.grantToken(token.address, { from: machine_1 })
        })

        it('should add track correctly', async () => {
          const message = 'kittiesarefordummies'
          const hash = EthCrypto.hash.keccak256(message)
          const signature = EthCrypto.sign(token.privateKey, hash)

          receipt = await chaos.addTrack(hash, signature, 'QmAwesomeHash', {
            from: user_1
          })
          let track = await chaos.tracks(0)
          assert.equal(track[0], user_1)
          assert.equal(track[1], 'QmAwesomeHash')
        })

        it("should revoke 'token' role correctly", async () => {
          assert.equal(await chaos.hasRole(token.address, 'token'), false)
        })

        it("should emit a 'TrackAdded' event correctly", async () => {
          const event = await expectEvent.inLogs(receipt.logs, 'TrackAdded')
          assert.equal(event.args.cid, 'QmAwesomeHash')
          assert.equal(event.args.uploader, user_1)
        })
      })

      context('when not called with an authorized token, it', () => {
        before(async () => {
          chaos = await Chaos.new({ from: admin })
        })

        it('should revert', async () => {
          const fake = EthCrypto.createIdentity()
          const message = 'kittiesarefordummies'
          const hash = EthCrypto.hash.keccak256(message)
          const signature = EthCrypto.sign(fake.privateKey, hash)

          await assertRevert(
            chaos.addTrack(hash, signature, 'QmAwesomeHash', {
              from: user_1
            })
          )
        })
      })
    })

    context('#removeTrack', () => {
      context("when called from an 'admin' account, it", () => {
        let receipt, token_1, token_2

        before(async () => {
          chaos = await Chaos.new({ from: admin })

          await chaos.grantMachine(machine_1, { from: admin })

          token_1 = EthCrypto.createIdentity()
          token_2 = EthCrypto.createIdentity()

          await chaos.grantToken(token_1.address, { from: machine_1 })
          await chaos.grantToken(token_2.address, { from: machine_1 })

          const message_1 = 'kittiesarefordummies'
          const hash_1 = EthCrypto.hash.keccak256(message_1)
          const signature_1 = EthCrypto.sign(token_1.privateKey, hash_1)

          const message_2 = 'kittiesarefordummies'
          const hash_2 = EthCrypto.hash.keccak256(message_2)
          const signature_2 = EthCrypto.sign(token_2.privateKey, hash_2)

          await chaos.addTrack(hash_1, signature_1, 'QmAwesomeHash_1', {
            from: user_1
          })
          await chaos.addTrack(hash_2, signature_2, 'QmAwesomeHash_2', {
            from: user_2
          })
        })

        it('should remove track correctly', async () => {
          receipt = await chaos.removeTrack(0, { from: admin })
          let track = await chaos.tracks(0)
          assert.equal(track[0], user_2)
          assert.equal(track[1], 'QmAwesomeHash_2')
        })

        it("should emit a 'TrackRemoved' event correctly", async () => {
          const event = await expectEvent.inLogs(receipt.logs, 'TrackRemoved')
          assert.equal(event.args.cid, 'QmAwesomeHash_1')
        })
      })

      context("when not called from an 'admin' account, it", () => {
        let token_1, token_2

        before(async () => {
          chaos = await Chaos.new({ from: admin })

          await chaos.grantMachine(machine_1, { from: admin })

          token_1 = EthCrypto.createIdentity()
          token_2 = EthCrypto.createIdentity()

          await chaos.grantToken(token_1.address, { from: machine_1 })
          await chaos.grantToken(token_2.address, { from: machine_1 })

          const message_1 = 'kittiesarefordummies'
          const hash_1 = EthCrypto.hash.keccak256(message_1)
          const signature_1 = EthCrypto.sign(token_1.privateKey, hash_1)

          const message_2 = 'kittiesarefordummies'
          const hash_2 = EthCrypto.hash.keccak256(message_2)
          const signature_2 = EthCrypto.sign(token_2.privateKey, hash_2)

          await chaos.addTrack(hash_1, signature_1, 'QmAwesomeHash_1', {
            from: user_1
          })
          await chaos.addTrack(hash_2, signature_2, 'QmAwesomeHash_2', {
            from: user_2
          })
        })

        it('should revert', async () => {
          await assertRevert(chaos.removeTrack(0, { from: unauthorized }))
          let track = await chaos.tracks(0)
          assert.equal(track[0], user_1)
          assert.equal(track[1], 'QmAwesomeHash_1')
        })
      })
    })

    context('#shuffle', () => {
      let token_1, token_2, token_3, token_4, token_5, token_6

      before(async () => {
        chaos = await Chaos.new({ from: admin })

        await chaos.grantMachine(machine_1, { from: admin })

        token_1 = EthCrypto.createIdentity()
        token_2 = EthCrypto.createIdentity()
        token_3 = EthCrypto.createIdentity()
        token_4 = EthCrypto.createIdentity()
        token_5 = EthCrypto.createIdentity()
        token_6 = EthCrypto.createIdentity()

        await chaos.grantToken(token_1.address, { from: machine_1 })
        await chaos.grantToken(token_2.address, { from: machine_1 })
        await chaos.grantToken(token_3.address, { from: machine_1 })
        await chaos.grantToken(token_4.address, { from: machine_1 })
        await chaos.grantToken(token_5.address, { from: machine_1 })
        await chaos.grantToken(token_6.address, { from: machine_1 })

        const message_1 = 'kittiesarefordummies'
        const hash_1 = EthCrypto.hash.keccak256(message_1)
        const signature_1 = EthCrypto.sign(token_1.privateKey, hash_1)

        const message_2 = 'kittiesarefordummies'
        const hash_2 = EthCrypto.hash.keccak256(message_2)
        const signature_2 = EthCrypto.sign(token_2.privateKey, hash_2)

        const message_3 = 'kittiesarefordummies'
        const hash_3 = EthCrypto.hash.keccak256(message_3)
        const signature_3 = EthCrypto.sign(token_3.privateKey, hash_3)

        const message_4 = 'kittiesarefordummies'
        const hash_4 = EthCrypto.hash.keccak256(message_4)
        const signature_4 = EthCrypto.sign(token_4.privateKey, hash_4)

        const message_5 = 'kittiesarefordummies'
        const hash_5 = EthCrypto.hash.keccak256(message_5)
        const signature_5 = EthCrypto.sign(token_5.privateKey, hash_5)

        const message_6 = 'kittiesarefordummies'
        const hash_6 = EthCrypto.hash.keccak256(message_6)
        const signature_6 = EthCrypto.sign(token_6.privateKey, hash_6)

        await chaos.addTrack(hash_1, signature_1, 'QmAwesomeHash_1', {
          from: user_1
        })
        await chaos.addTrack(hash_2, signature_2, 'QmAwesomeHash_2', {
          from: user_2
        })
        await chaos.addTrack(hash_3, signature_3, 'QmAwesomeHash_3', {
          from: user_1
        })
        await chaos.addTrack(hash_4, signature_4, 'QmAwesomeHash_4', {
          from: user_2
        })
        await chaos.addTrack(hash_5, signature_5, 'QmAwesomeHash_5', {
          from: user_1
        })
        await chaos.addTrack(hash_6, signature_6, 'QmAwesomeHash_6', {
          from: user_2
        })
      })

      it('should return a random track cid', async () => {
        const cid = await chaos.shuffle()

        assert.oneOf(cid, [
          'QmAwesomeHash_1',
          'QmAwesomeHash_2',
          'QmAwesomeHash_3',
          'QmAwesomeHash_4',
          'QmAwesomeHash_5',
          'QmAwesomeHash_6'
        ])
      })
    })
  })
})
