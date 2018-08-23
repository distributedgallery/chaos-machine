import yargs from 'yargs'
import * as chaosconfig from '../../lib/config'
import prompt from '../../ui/inquirer'

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
    .option('contract', {
      describe: 'Set chaos contract address',
      type: 'string'
    })
    .option('devices', {
      describe: 'Enable chaos machine devices',
      type: 'boolean'
    })
    .help()
    .version(false)
}

const handler = async (argv) => {
  try {
    if (!chaosconfig.exists()) { chaosconfig.init() }

    if (argv.ipfs) {
      const current = chaosconfig.load()
      current.ipfs = argv.ipfs
      chaosconfig.save(current)
    } else if (argv.ethereum) {
      const current = chaosconfig.load()
      current.ethereum = argv.ethereum
      chaosconfig.save(current)
    } else if (argv.contract) {
      const current = chaosconfig.load()
      current.contract = argv.contract
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
    /* tslint:disable:no-console*/
    console.log('[error] ' + err.message)
    /* tslint:enable:no-console */
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
