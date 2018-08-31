import IPFS from 'ipfs-api'
import contractor from 'truffle-contract'
import parser from 'url-parse'
import Web3 from 'web3'
import Track from './track'

export default class Client {

  public static defaults = {
    contract: '0xcdf45df24d878dd7e564a72802ba23031acfac07',
    ipfs: 'https://ipfs.infura.io:5001',
    provider: new Web3.providers.HttpProvider('http://localhost:8545')
  }

  public ipfs: any
  public provider: any
  public abstraction: any
  public contract: any
  public track: Track

  constructor({ ipfs = Client.defaults.ipfs, provider = Client.defaults.provider, contract = Client.defaults.contract }:
    { ipfs?: string; provider?: any; contract?: string } = {}) {
    // IPFS
    const url = parser(ipfs)
    this.ipfs = IPFS(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) })
    // provider
    this.provider = provider
    // abstraction
    this.abstraction = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
    this.abstraction.setProvider(this.provider)
    // contract
    this.contract = this.abstraction.at(contract)
    // track
    this.track = new Track(this)
  }
}
