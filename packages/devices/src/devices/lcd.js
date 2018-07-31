const LCD = require('lcd');
const EventEmitter = require('events');

class Lcd extends EventEmitter {
	constructor(opts) {
		super();
		if (!opts.rs || !opts.e || !opts.data || opts.data.length !== 4)
			throw new Error('[Lcd] Please specifiy the correct pins!');
		this.lcd = new LCD(opts);
		this.lcd.on('ready', () => this.emit('ready'));
	}

	write(text, cb) {
		this.lcd.setCursor(0, 0);
		this.lcd.print(text, err => cb && cb(err));
	}

	close() {
		if (this.lcd) this.lcd.close();
	}
}

module.exports = Lcd;
