import IPFS from 'ipfs-api'
import contractor from 'truffle-contract'
import parser from 'url-parse'
import Web3 from 'web3'
import Track from './track'

const DEFAULTS = {
  ADDRESS: '0xcdf45df24d878dd7e564a72802ba23031acfac07',
  IPFS: 'https://ipfs.infura.io:5001',
  PROVIDER: new Web3.providers.HttpProvider('http://localhost:8545')
}

export default class Client {
  public ipfs: any
  public provider: any
  public abstraction: any
  public contract: any
  public track: Track

  constructor({ ipfs = DEFAULTS.IPFS, provider = DEFAULTS.PROVIDER, address = DEFAULTS.ADDRESS }:
    { ipfs?: string; provider?: any; address?: string } = {}) {
    // IPFS
    const url = parser(ipfs)
    this.ipfs = IPFS(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) })
    // provider
    this.provider = provider
    // abstraction
    this.abstraction = contractor(
      require('@chaosmachine/core/build/contracts/Chaos.json')
    )
    this.abstraction.setProvider(this.provider)
    // contract
    this.contract = this.abstraction.at(address)
    // track
    this.track = new Track(this)
  }
}
