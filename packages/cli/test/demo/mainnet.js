import { Machine } from '@chaosmachine/chaos.js'
import { token_1 } from './data'

const main = async () => {
  const machine = new Machine()
  await machine.start()

  console.log('Registering token')
  await machine.token.register(token_1.address)
  console.log('Token registered')
  process.exit(0)
}

main()
