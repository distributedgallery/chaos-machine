import IPFS from 'ipfs-api'
import os from 'os'
import path from 'path'
import contractor from 'truffle-contract'
import HDWalletProvider from 'truffle-hdwallet-provider'
import parser from 'url-parse'
import util from 'util'
import Web3 from 'web3'
import Audio from './audio'
import Cash from './devices/cash'
import LCD from './devices/lcd'
import Printer from './devices/printer'
import Relay from './devices/relay'
import fs from './fs'
import Log from './log'
import Token from './token'
import Track from './track'

let ILCD
let IRelay
(async () => {
  if (os.type() === 'Linux') {
    ILCD = await import('./devices/lcd')
    IRelay = await import('./devices/relay')
  } else {
    ILCD = await import('./devices/lcd-spoof')
    IRelay = await import('./devices/relay-spoof')
  }
})()

const DEFAULTS = {
  ADDRESS: '0xcdf45df24d878dd7e564a72802ba23031acfac07',
  DEVICES: false,
  ETHEREUM: 'https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09',
  IPFS: 'https://ipfs.infura.io:5001',
  MNEMONIC: 'journey nice rather ball theme used uncover gate pond rifle between state'
}

export default class Machine {
  public static async launch(opts?: any): Promise<Machine> {
    const machine = new Machine(opts)
    const web3 = new Web3(machine.provider)
    const accounts = await util.promisify(web3.eth.getAccounts)()

    if (!machine.fs.exists(machine.paths.root)) { machine.fs.mkdir(machine.paths.root) }
    if (!machine.fs.exists(machine.paths.tracks)) { machine.fs.mkdir(machine.paths.tracks) }

    machine.abstraction.defaults({ from: accounts[0] })

    const event = machine.contract.TokenGranted({}, { fromBlock: 'latest', toBlock: 'latest' })
    event.watch((err, result) => {
      if (err) {
        machine.log.error(err)
      } else {
        machine.log.info('Token granted', { machine: result.args.machine, token: result.args.token })
        machine.audio.shuffle()
      }
    })

    return machine
  }

  // core
  public ipfs: any
  public mnemonic: string
  public provider: any
  public abstraction: any
  public contract: any
  // utils
  public paths: any
  public fs: any
  // components
  public log: Log
  public token: Token
  public track: Track
  public audio: Audio
  // devices
  public cash?: Cash
  public printer?: Printer
  public lcd?: LCD
  public fans?: Relay
  public resistor?: Relay

  constructor({
    ipfs = DEFAULTS.IPFS,
    ethereum = DEFAULTS.ETHEREUM,
    mnemonic = DEFAULTS.MNEMONIC,
    address = DEFAULTS.ADDRESS,
    devices = DEFAULTS.DEVICES
  }: {
    ipfs?: string
    ethereum?: string
    mnemonic?: string
    address?: string
    devices?: boolean
  } = {}) {
    // IPFS
    const url = parser(ipfs)
    this.ipfs = IPFS(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) })
    // mnemonic
    this.mnemonic = mnemonic
    // HDWallet provider
    this.provider = new HDWalletProvider(mnemonic, ethereum)
    // abstraction
    this.abstraction = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
    this.abstraction.setProvider(this.provider)
    // contract
    this.contract = this.abstraction.at(address)
    // utils
    this.fs = fs
    this.paths = {
      log: path.join(os.homedir(), '.chaos', 'log'),
      root: path.join(os.homedir(), '.chaos'),
      tracks: path.join(os.homedir(), '.chaos', 'tracks')
    }
    // components
    this.log = new Log(this)
    this.track = new Track(this)
    this.audio = new Audio(this)
    this.token = new Token(this)

    // devices
    if (devices) {
      this.cash = new Cash({ port: '/dev/cash' })
      this.printer = new Printer({ port: '/dev/printer' })
      this.lcd = new ILCD({ rs: 25, e: 24, data: [23, 17, 27, 22] })
      this.fans = new IRelay({ pin: 4 })
      this.resistor = new IRelay({ pin: 3 })
      // initialization
      this.cash!.on('ready', () => this.log.info('Cash ready'))
      this.printer!.on('ready', () => {
        this.log.info('Printer ready')
        this.printer!.print('https://www.distributedgallery.com')
      })
      this.lcd!.on('ready', () => {
        this.log.info('LCD ready')
        this.lcd!.write('WELCOME CHAOS', (err) => {
          if (err) { this.log.error(err.toString()) }
        })
      })
      // event handling
      this.printer!.on('done', (data) => this.log.info('Printed'))
      this.cash!.on('accepted', () => {
        this.lcd!.write('BURNING BILL', (err) => {
          if (err) { this.log.error(err.toString()) }
        })
        this.resistor!.turnOn()
        setTimeout(() => {
          this.resistor!.turnOff()
          this.fans!.turnOn()
          setTimeout(() => this.fans!.turnOff(), 10000)
          const token = this.token.generate()
          this.printer!.print('https://chaos.distributedgallery.com/upload/' + token.privateKey)
          this.lcd!.write('TAKE YOUR TICKET', (err) => {
            if (err) { this.log.error(err.toString()) }
          })
          setTimeout(() => {
            this.lcd!.write('WELCOME CHAOS', (err) => {
              if (err) { this.log.error(err.toString()) }
            })
          }, 10000)
          this.token.register(token.address).catch((err) => {
            this.log.error(err.toString())
          })
        }, 15000)
      })

      // exit process nicely
      process.on('SIGINT', () => process.exit(0))
      process.on('uncaughtException', (err) => {
        this.log.error(err.toString())
        setTimeout(() => { process.exit(1) }, 500)
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
}
