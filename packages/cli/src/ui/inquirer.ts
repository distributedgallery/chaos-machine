import { Machine } from '@chaosmachine/chaos.js'
import * as inquirer from 'inquirer'
import Web3 from 'web3'

const web3  = new Web3()
const regex = new RegExp(/(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/)

const questions = {
  /* tslint:disable:object-literal-sort-keys */
  ipfs: {
    name: 'ipfs',
    type: 'input',
    message: 'IPFS gateway: ',
    default: Machine.defaults.ipfs,
    validate: async (value: string) => {
      if (value.match(regex)) {
        return true
      } else {
        return 'Invalid URL'
      }
    }
  },
  ethereum: {
    name: 'ethereum',
    type: 'input',
    message: 'Ethereum gateway: ',
    default: Machine.defaults.ethereum,
    validate: async (value: string) => {
      if (value.match(regex)) {
        return true
      } else {
        return 'Invalid URL'
      }
    }
  },
  contract: {
    name: 'contract',
    type: 'input',
    message: 'Contract address: ',
    default: Machine.defaults.contract,
    validate: async (value: string) => {
      if (web3.isAddress(value)) {
        return true
      } else {
        return 'Invalid address'
      }
    }
  },
  devices: {
    name: 'devices',
    type: 'confirm',
    message: 'Enable devices: ',
    default: Machine.defaults.devices
  }
  /* tslint:enable:object-literal-sort-keys */
}

const prompt = {
  configure: async (): Promise<any> => {
    const ipfs     = await inquirer.prompt(questions.ipfs)
    const ethereum = await inquirer.prompt(questions.ethereum)
    const contract = await inquirer.prompt(questions.contract)
    const devices  = await inquirer.prompt(questions.devices)
    return { ...ipfs, ...ethereum, ...contract, ...devices }
  }
}

export default prompt
