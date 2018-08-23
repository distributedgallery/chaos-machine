import IPFS from 'ipfs-api'
import os from 'os'
import path from 'path'
import contractor from 'truffle-contract'
// import HDWalletProvider from 'truffle-hdwallet-provider'
import parser from 'url-parse'
import util from 'util'
import Web3 from 'web3'
import Audio from './audio'
import Cash from './devices/cash'
import Lcd from 'lcd'
import Printer from './devices/printer'
import Relay from './devices/relay-spoof'
import fs from './fs'
import Log from './log'
import Token from './token'
import Track from './track'


interface LCD {
  lcd: Lcd
  on(event: string, cb: Function): void
  write(text: string, cb: Function): void
  close(): void
}


// interface LCD


const LCD = os.type() === 'Linux' ? require('./devices/lcd') : require('./devices/lcd-spoof')



// let IRelay
// (async () => {
//   console.log(os.type())
//   if (os.type() === 'Linux') {
//
//     ILCD = await import('./devices/lcd')
//     IRelay = await import('./devices/relay')
//   } else {
//     ILCD = await import('./devices/lcd-spoof')
//     IRelay = await import('./devices/relay-spoof')
//   }
// })()

// const DEFAULTS = {
//   ADDRESS: '0xcdf45df24d878dd7e564a72802ba23031acfac07'
//   CONTRACT: '0xcdf45df24d878dd7e564a72802ba23031acfac07',
//   DEVICES: false,
//   ETHEREUM: 'http://localhost:8545',
//   IPFS: 'https://ipfs.infura.io:5001',
//   MNEMONIC: 'journey nice rather ball theme used uncover gate pond rifle between state'
// }

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default class Machine {
  // defaults parameters
  public static defaults = {
    contract: '0xcdf45df24d878dd7e564a72802ba23031acfac07',
    devices: false,
    ethereum: 'http://localhost:8545',
    ipfs: 'https://ipfs.infura.io:5001'
  }
  // core
  public ipfs:        any
  public web3:        any
  public abstraction: any
  public contract:    any
  // utils
  public paths: any
  public fs:    any
  // components
  public log:   Log
  public token: Token
  public track: Track
  public audio: Audio
  // devices
  public cash?:     Cash
  public printer?:  Printer
  public lcd?:      LCD
  public fans?:     Relay
  public resistor?: Relay

  constructor({
    contract = Machine.defaults.contract,
    devices  = Machine.defaults.devices,
    ethereum = Machine.defaults.ethereum,
    ipfs     = Machine.defaults.ipfs
  }: {
    contract?: string
    devices?:  boolean
    ethereum?: string
    ipfs?:     string
  } = {}) {
    // IPFS
    const url = parser(ipfs)
    this.ipfs = IPFS(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) })
    // web3
    this.web3 = new Web3(new Web3.providers.HttpProvider(ethereum))
    // abstraction
    this.abstraction = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
    this.abstraction.setProvider(this.web3.currentProvider)
    // contract
    this.contract = this.abstraction.at(contract)
    // utils
    this.fs = fs
    this.paths = {
      log: path.join(os.homedir(), '.chaos', 'log'),
      root: path.join(os.homedir(), '.chaos'),
      tracks: path.join(os.homedir(), '.chaos', 'tracks')
    }
    // components
    this.log   = new Log(this)
    this.track = new Track(this)
    this.audio = new Audio(this)
    this.token = new Token(this)
    // devices
    if (devices) {
      try {
        this.cash     = new Cash({ port: '/dev/cash' })
        this.printer  = new Printer({ port: '/dev/printer' })
        this.lcd      = new LCD({ rs: 25, e: 24, data: [23, 17, 27, 22] })
        this.fans     = new Relay({ pin: 15 })
        this.resistor = new Relay({ pin: 14 })

        // initialization
        this.fans!.turnOn()
        this.cash!.on('ready', () => this.log.info('Cash ready'))
        this.printer!.on('ready', () => {
          this.log.info('Printer ready')
          this.printer!.print('https://www.distributedgallery.com')
        })
        this.lcd!.on('ready', () => {
          this.log.info('LCD ready')
          this.lcd!.write('HI, CHAOS MACHINE', (err) => {
            if (err) { this.log.error(err.toString()) }
          })
        })
        // event handling
        this.printer!.on('done', (data) => this.log.info('QRCode printed'))
        this.cash!.on('accepted', async () => {
          try {
            this.log.info('Bill burning')
            this.lcd!.write('BURNING BILL', (err) => {
              if (err) { this.log.error(err.toString()) }
            })
            this.cash!.ssp.disable()
            this.resistor!.turnOn()
            await timeout(20000)
            this.resistor!.turnOff()
            await timeout(5000)
            this.resistor!.turnOn()
            await timeout(10000)
            this.resistor!.turnOff()
            const token = this.token.generate()
            this.log.info('Generating token', { token: token.address})
            this.printer!.printShort('https://chaos.distributedgallery.com/upload/' + token.privateKey)
            this.lcd!.write('TAKE YOUR TICKET', (err) => {
              if (err) { this.log.error(err.toString()) }
            })
            this.log.info('Registering token', { token: token.address })
            await this.token.register(token.address)
            this.log.info('Token registered', { token: token.address })
            this.lcd!.write('WELCOME CHAOS', (err) => {
              if (err) { this.log.error(err.toString()) }
            })
            this.cash!.ssp.enable()
          } catch (err) {
            this.log.error(err.toString())
          }


        })
      } catch (err) {
        this.log.error(err.toString())
      }
      // exit process nicely
      process.on('SIGINT', () => process.exit(0))
      process.on('uncaughtException', (err) => {
        this.log.error(err.toString())
      })
      process.on('unhandledRejection', (reason, p) => {
          this.log.error(reason)
      })
      process.on('exit', () => {
        this.cash!.close()
        this.printer!.close()
        this.lcd!.close()
        this.fans!.close()
        this.resistor!.close()
      })
    }
  }

  public async start(): Promise<void> {
    if (!this.fs.exists(this.paths.root)) { this.fs.mkdir(this.paths.root) }
    if (!this.fs.exists(this.paths.tracks)) { this.fs.mkdir(this.paths.tracks) }

    const accounts = await util.promisify(this.web3.eth.getAccounts)()
    this.abstraction.defaults({ from: accounts[0] })

    const event = this.contract.TokenGranted({}, { fromBlock: 'latest', toBlock: 'latest' })
    event.watch((err, result) => {
      if (err) {
        this.log.error(err)
      } else {
        this.log.info('Token granted', { machine: result.args.machine, token: result.args.token })
        this.audio.shuffle()
      }
    })
  }

}
