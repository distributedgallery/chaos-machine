import Machine   from '../'
import EthCrypto from 'eth-crypto'
import Web3 from 'web3'

export default class Token {
  public machine: Machine

  constructor(machine: Machine) {
    this.machine = machine
  }

  public generate(): any {
    return EthCrypto.createIdentity()
  }

  public async register(address: string, opts?: any): Promise<any> {
    const gasPrice = this.machine.web3.eth.gasPrice
    const estimate = await this.machine.contract.grantToken.estimateGas(address)
    this.machine.log.info('Submitting grantToken transaction', { gas: estimate, gasPrice: 2 * gasPrice.toNumber()})
    const receipt = await this.machine.contract.grantToken(address, { gas: 2 * estimate, gasPrice: 2 * gasPrice.toNumber(), ...opts })

    return receipt
  }
}
