const Cash = require('./cash');
const Printer = require('./printer');

// create the cash machine
const cash = new Cash({ port: '/dev/tty.usbserial-A600LEFH' });
// cash machine is ready
cash.on('ready', () => console.log('[Cash] ready'));
// cash machine accepted a note
cash.on('accepted', console.log);

// create the printer machine
const printer = new Printer({ port: '/dev/tty.usbserial' });
// printer machine is ready
printer.on('ready', () => {
	console.log('[Printer] ready');
	printer.print('https://drangies.fr');
});

// closing process nicely
process.on('SIGINT', () => process.exit(0));
process.on('uncaughtException', err => {
	console.log(err.stack);
	setTimeout(() => {
		process.exit(1);
	}, 500);
});
process.on('exit', () => {
	cash.close();
	printer.close();
});
