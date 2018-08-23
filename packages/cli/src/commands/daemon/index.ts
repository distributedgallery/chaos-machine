import { Machine } from '@chaosmachine/chaos.js'
import logo from 'asciiart-logo'
import yargs from 'yargs'
import * as config from '../../lib/config'

const builder = () => {
  return yargs
    .help()
    .version(false)
}

const handler = async (argv) => {
  try {
    if (!config.exists()) {
      /* tslint:disable:no-console*/
      console.log('You need to configure your chaos machine before you the daemon.')
      console.log('Run: chaos config')
      /* tslint:enable:no-console*/
    } else {
      const opts = config.load()

      /* tslint:disable:no-console*/
      console.log(
        logo({
          font: '3D-ASCII',
          lineChars: 15,
          margin: 2,
          name: 'CHAOS',
          padding: 5
        })
        .emptyLine()
        .left('ipfs: ' + opts.ipfs)
        .left('ethereum: ' + opts.ethereum)
        .left('contract: ' + opts.contract)
        .left('devices: ' + opts.devices)
        .emptyLine()
        .wrap('Have fun burning bills!')
        .render()
      )
      /* tslint:enable:no-console*/

      const machine = new Machine(opts)
      await machine.start()
    }
  } catch (err) {
    /* tslint:disable:no-console*/
    console.log('[error] ' + err.message)
    /* tslint:enable:no-console*/
  }
}

/* tslint:disable:object-literal-sort-keys */
export const daemon = {
  command: 'daemon',
  desc: 'Launch the Chaos Machine daemon',
  builder,
  handler
}
/* tslint:enable:object-literal-sort-keys */
