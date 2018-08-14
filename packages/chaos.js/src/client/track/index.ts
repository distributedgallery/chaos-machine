import EthCrypto from 'eth-crypto'
import Client from '../'

export default class Track {
  public client: Client

  constructor(client: Client) {
    this.client = client
  }

  public async upload(buffer: any): Promise<string> {
    console.log('upload')
    const results = await this.client.ipfs.files.add(buffer, { pin: true })
    return results[0].hash
  }

  public async register( cid: string, privateKey: string, opts?: any): Promise<any> {
    const message = 'kittiesarefordummies'
    const hash = EthCrypto.hash.keccak256(message)
    const signature = EthCrypto.sign(privateKey, hash)
    const estimate = await this.client.contract.addTrack.estimateGas(hash, signature, cid)
    const receipt = await this.client.contract.addTrack(hash, signature, cid, { gas: 2 * estimate, ...opts })

    return receipt
  }
}
