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

let Lcd
(async () => {
  if (os.type() === 'Linux') {
    Lcd = await import('./devices/lcd')
  } else {
    Lcd = await import('./devices/lcd-spoof')
  }
})()

const DEFAULTS = {
  ADDRESS: '0x7e8dcb7432b8356635f2820b8e92fa6d760609fe',
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
        machine.log.info('[event:TokenGranted][machine:' + result.args.machine + '][token:' + result.args.token + ']')
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
      this.lcd = new Lcd({ rs: 25, e: 24, data: [23, 17, 27, 22] })
      // this.fans 		= new Relay({ pin: 4 })
      // this.resistor = new Relay({ pin: 3 })

      this.cash!.on('ready', () => this.log.info('[cash][ready]'))
      this.printer!.on('ready', () => this.log.info('[printer][ready]'))
      this.lcd!.on('ready', () => {
        this.log.info('[lcd][ready]')
        this.lcd!.write('Welcome chaos', (err) => {
          this.log.error(err.toString())
        })
      })

      // exist process nicely
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
