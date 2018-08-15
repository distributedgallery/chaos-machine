import * as chaosconfig from '../../lib/config'
import prompt from '../../ui/inquirer'
import yargs from 'yargs'

const builder = () => {
  return yargs
    .option('ipfs', {
      describe: 'Set IPFS gateway address',
      type: 'string'
    })
    .option('ethereum', {
      describe: 'Set ethereum gateway address',
      type: 'string'
    })
    .option('address', {
      describe: 'Set contract address',
      type: 'string'
    })
    .option('mnemonic', {
      describe: 'Set ethereum account mnemonic',
      type: 'string'
    })
    .option('devices', {
      describe: 'Enable chaos machine devices',
      type: 'boolean'
    })
    .help()
    .version(false)
}

const handler = async argv => {
  try {
    if(!chaosconfig.exists()) { chaosconfig.init() }

    if(argv.ipfs) {
      const current = chaosconfig.load()
      current.ipfs = argv.ipfs
      chaosconfig.save(current)
    } else if (argv.ethereum) {
      const current = chaosconfig.load()
      current.ethereum = argv.ethereum
      chaosconfig.save(current)
    } else if (argv.address) {
      const current = chaosconfig.load()
      current.address = argv.address
      chaosconfig.save(current)
    } else if (argv.mnemonic) {
      const current = chaosconfig.load()
      current.mnemonic = argv.mnemonic
      chaosconfig.save(current)
    } else if (typeof argv.devices !== 'undefined') {
      const current = chaosconfig.load()
      current.devices = argv.devices
      chaosconfig.save(current)
    } else {
      const configuration = await prompt.configure()
      chaosconfig.save(configuration)
    }
  } catch (err) {
    console.log('[error] ' + err.message)
  }
}

/* tslint:disable:object-literal-sort-keys */
export const config = {
  command: 'config',
  desc: 'Configure the Chaos Machine',
  builder,
  handler
}
/* tslint:enable:object-literal-sort-keys */
