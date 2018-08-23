import Lcd from 'lcd'
import EventEmitter from 'events'
import os from 'os'

export default class LCD extends EventEmitter {

	public lcd?: Lcd

	constructor(opts) {
		super();

		if (!opts.rs || !opts.e || !opts.data || opts.data.length !== 4) {
			throw new Error('[Lcd] Please specifiy the correct pins');

		}
		this.lcd = new Lcd(opts);
		this.lcd.on('ready', () => this.emit('ready'));
	}

	write(text, cb) {
		// this.lcd.setCursor(0, 0);
		this.lcd.clear((err, result) => {
			this.lcd.print(text, err => cb && cb(err));
		})
	}

	close() {
		if (this.lcd) {
			this.lcd.clear((err, result) => this.lcd.close())
		}
	}
}
