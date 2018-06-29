const Cash = require('./devices/cash');
const Printer = require('./devices/printer');
const Relay = require('./devices/relay');

// create the cash machine
const cash = new Cash({ port: '/dev/cash' });
// cash machine is ready
cash.on('ready', () => console.log('[Cash] ready'));
// cash machine accepted a note
cash.on('accepted', console.log);

// create the printer machine
const printer = new Printer({ port: '/dev/printer' });
// printer machine is ready
printer.on('ready', () => {
	console.log('[Printer] ready');
	printer.print('https://drangies.fr');
});

// create the fans
// NOTE: only works on the Rpi
// const fans = new Relay({ pin: 17 });
// fans.turnOn();
// setTimeout(() => fans.turnOff(), 1000);

// create the resistor
// NOTE: only works on the Rpi
// const resistor = new Relay({ pin: 27 });
// resistor.turnOn();
// setTimeout(() => resistor.turnOff(), 1000);

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
	fans.close();
	resistor.close();
});
