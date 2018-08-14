import { Gpio } from 'onoff'

export default class Relay {

	public gpio: any

	constructor(opts) {
		if (!opts.pin) throw new Error('[Relay] Please specify a pin!');
		if (Gpio.accessible) this.gpio = new Gpio(opts.pin, 'out');
		else {
			this.gpio = {
				writeSync: value => console.log(`writing: ${value}`),
				unexport: () => console.log(`unexporting`),
			};
		}
	}

	turnOn() {
		this.gpio.writeSync(1);
	}

	turnOff() {
		this.gpio.writeSync(0);
	}

	close() {
		if (Gpio.accessible) this.gpio.unexport();
	}
}
