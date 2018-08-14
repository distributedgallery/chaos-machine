import Machine   from '../'
import EthCrypto from 'eth-crypto'


export default class Token {
  public machine: Machine

  constructor(machine: Machine) {
    this.machine = machine
  }

  public generate(): any {
    return EthCrypto.createIdentity()
  }

  public async register(address: string, opts?: any): Promise<any> {
    const estimate = await this.machine.contract.grantToken.estimateGas(address)
    const receipt  = await this.machine.contract.grantToken(address, { gas: 2 * estimate, ...opts })

    return receipt
  }
}
