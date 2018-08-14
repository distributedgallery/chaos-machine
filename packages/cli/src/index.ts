import yargs from 'yargs'
import * as commands from './commands'

const argv = yargs
  .usage('chaos <command>')
  .command(commands.daemon)
  .demandCommand(1, 'No command provided')
  .strict()
  .help()
  .alias('h', 'help').argv

const Cash 		= require('./devices/cash')
const Printer = require('./devices/printer')
const Relay 	= require('./devices/relay')
const LCD 		= require('./devices/lcd')

import ChaosMachine from './machine'

// Initialize devices
// const cash 		= new Cash({ port: '/dev/cash' })
// const printer 	= new Printer({ port: '/dev/printer' })
// const fans 		= new Relay({ pin: 4 })
// const resistor = new Relay({ pin: 3 })
// const lcd 			= new Lcd({ rs: 25, e: 24, data: [23, 17, 27, 22] })
const machine = new ChaosMachine()





// Initialization log
// cash.on('ready', () => console.log('[Cash] ready'))
// printer.on('ready', () => console.log('[Printer] ready'))
// lcd.on('ready', () => console.log('[LCD] ready'))


// cash machine accepted a note
// cash.on('accepted',async  () => {
// 	try {
// 		const token = chaos.generateToken()
// 		printer.print('https://chaos.distributedgallery.com/upload?token=' + token.privateKey)
// 		const receipt = await chaos.registerToken(token.address)
// 	} catch (err) {
// 		console.log('[Error][TGE][' + err + ']')
// 	}
//
//
// })

// chaos.on('burnminted', () => {
//
// })
//
// chaos.watch((err, result) => {
// 	const cid = chaos.shuffle
// 	if(!file.exists(cid)) { on télécharge}
// 	play
// 	https://www.npmjs.com/package/node-mp3-player
// })


// Closing process properly
process.on('SIGINT', () => process.exit(0))
process.on('uncaughtException', err => {
	console.log(err.stack)
	setTimeout(() => {
		process.exit(1)
	}, 500)
})
// process.on('exit', () => {
// 	cash.close()
// 	printer.close()
// 	fans.close()
// 	resistor.close()
// 	lcd.close()
// })
