import * as inquirer from 'inquirer'
import Web3 from 'web3'

const web3 = new Web3()
const DEFAULTS = {
  ADDRESS: '0xcdf45df24d878dd7e564a72802ba23031acfac07',
  DEVICES: false,
  ETHEREUM: 'https://mainnet.infura.io/v3/ab05225130e846b28dc1bb71d6d96f09',
  IPFS: 'https://ipfs.infura.io:5001',
  MNEMONIC: 'journey nice rather ball theme used uncover gate pond rifle between state'
}
const regex = new RegExp(/(?:^|\s)((https?:\/\/)?(?:localhost|[\w-]+(?:\.[\w-]+)+)(:\d+)?(\/\S*)?)/)

export const questions = {
  /* tslint:disable:object-literal-sort-keys */
  ipfs: {
    name: 'ipfs',
    type: 'input',
    message: 'IPFS gateway: ',
    default: DEFAULTS.IPFS,
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
    default: DEFAULTS.ETHEREUM,
    validate: async (value: string) => {
      if (value.match(regex)) {
        return true
      } else {
        return 'Invalid URL'
      }
    }
  },
  mnemonic: {
    name: 'mnemonic',
    type: 'input',
    message: 'Mnemonic: ',
    default: DEFAULTS.MNEMONIC
  },
  address: {
    name: 'address',
    type: 'input',
    message: 'Contract address: ',
    default: DEFAULTS.ADDRESS,
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
    default: DEFAULTS.DEVICES
  }
  /* tslint:enable:object-literal-sort-keys */
}

export const prompt = {
  configure: async (): Promise<any> => {
    const ipfs = await inquirer.prompt(questions.ipfs)
    const ethereum = await inquirer.prompt(questions.ethereum)
    const mnemonic = await inquirer.prompt(questions.mnemonic)
    const address = await inquirer.prompt(questions.address)
    const devices = await inquirer.prompt(questions.devices)

    return { ...ipfs, ...ethereum, ...mnemonic, ...address, ...devices }
  }
}

export default prompt
