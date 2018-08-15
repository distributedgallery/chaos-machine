import * as config from '../../lib/config'
import logo from 'asciiart-logo'
import { Machine } from '@chaosmachine/chaos.js'
import yargs from 'yargs'

const builder = () => {
  return yargs
    .help()
    .version(false)
}

const handler = async argv => {
  try {
    if (!config.exists()) {
      console.log('You need to configure your chaos machine before you the daemon.')
      console.log('Run: chaos config')
    } else {
      const opts = config.load()

      console.log(
        logo({
          name: 'CHAOS',
          font: '3D-ASCII',
          lineChars: 15,
          padding: 5,
          margin: 2
        })
        .emptyLine()
        .left('ipfs: ' + opts.ipfs)
        .left('ethereum: ' + opts.ethereum)
        .left('mnemonic: ' + opts.mnemonic)
        .left('address: ' + opts.address)
        .left('devices: ' + opts.devices)
        .emptyLine()
        .wrap('Have fun burning bills!')
        .render()
      )

      const machine = await Machine.launch(opts)
    }
  } catch (err) {
    console.log('[error] ' + err.message)
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
