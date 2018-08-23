import fs          from 'fs'
import path        from 'path'
import { Machine } from '@chaosmachine/chaos.js'
import { token_4, token_5, token_6 } from './data'

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async () => {
  const address = fs.readFileSync(path.join('test', 'demo', 'address.txt'), 'utf8')
  const machine = new Machine({ contract: address })

  await machine.start()

  await machine.token.register(token_4.address)
  await timeout(30000)
  await machine.token.register(token_5.address)
  await timeout(30000)
  await machine.token.register(token_6.address)
}

main()
