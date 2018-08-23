import EthCrypto from 'eth-crypto'
import Web3 from 'web3'
import Machine from '../'

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
    const estimate = await this.machine.contract.grantToken.estimateGas(address, { from: this.machine.address! })
    this.machine.log.info('Granting token', { token: address, gas: estimate, gasPrice: 2 * gasPrice.toNumber()})
    const receipt = await this.machine.contract.grantToken(address, { from: this.machine.address!, gas: 2 * estimate, gasPrice: 2 * gasPrice.toNumber(), ...opts })

    return receipt
  }
}
