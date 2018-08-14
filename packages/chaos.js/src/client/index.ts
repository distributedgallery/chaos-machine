import parser     from 'url-parse'
import contractor from 'truffle-contract'
import IPFS       from 'ipfs-api'
import EthCrypto  from 'eth-crypto'
import Web3       from 'web3'


export default class Client {
  public ipfs:        any
  public provider:    any
  public abstraction: any
  public contract:    any

  constructor({ipfs='https://ipfs.infura.io:5001', ethereum='https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09', address='0x7e8dcb7432b8356635f2820b8e92fa6d760609fe'}: {ipfs?: string; ethereum?: string; address?: string}={}) {

    console.log('toto')

    //Add a watch options with default parameter to false // Or restrain this library for browser / metamask use and develop a new one for server use with only the registerToken and watch function // and an audio player

    // IPFS
    const url = parser(ipfs)
    this.ipfs = IPFS(url.hostname, url.port, { protocol: url.protocol.slice(0, -1) })
    // web3 // Handle HDWallet // Handle Metamask provider
    console.log('avant provider')
    this.provider = new Web3.providers.HttpProvider(ethereum)
    // abstraction
    this.abstraction = contractor(require('@chaosmachine/core/build/contracts/Chaos.json'))
    this.abstraction.setProvider(this.provider)
    // contract
    this.contract = this.abstraction.at(address)
  }

  public watch(cb: Function) {
    const event = this.contract.TokenGranted()
    event.watch(cb)
  }


  public generateToken(): any {
    return EthCrypto.createIdentity()
  }

  public async registerToken(address: string, opts?: any): Promise<string> {
    // Handle gas estmites
    const receipt = await this.contract.grantToken(address, opts)
    return receipt
  }

  public async uploadTrack(buffer: any): Promise<string> {
    const results = await this.ipfs.files.add(buffer, { pin: true })
    return results[0].hash
  }

  public async registerTrack(cid: string, privateKey: string, opts?: any): Promise<any> {
    const message   = 'kittiesarefordummies'
    const hash      = EthCrypto.hash.keccak256(message)
    const signature = EthCrypto.sign(privateKey, hash)
    const estimate  = await this.contract.addTrack.estimateGas(hash, signature, cid)

    opts = { gas: 2 * estimate, ...opts }

    const receipt = await this.contract.addTrack(hash, signature, cid, opts)

    return receipt
  }
}
