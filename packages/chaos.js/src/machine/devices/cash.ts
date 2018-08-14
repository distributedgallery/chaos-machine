import SSP from '@xavier.seignard/ssp'
import EventEmitter from 'events'

const notes = {
	1: { value: 5, display: '5€' },
	2: { value: 10, display: '10€' },
	3: { value: 20, display: '20€' },
	4: { value: 50, display: '50€' },
	5: { value: 100, display: '100€' },
	6: { value: 500, display: '500€' },
};

export default class Cash extends EventEmitter {
	public ssp: SSP
	
	constructor(opts) {
		super();
		if (!opts.port) throw new Error('[Cash] Please specify a serial port!');
		this.ssp = new SSP({
			device: opts.port,
			type: 'nv10usb',
			currencies: [1, 1, 1, 1, 1, 1],
		});
		this.ssp.init(true, () => {
			this.ssp.on('ready', () => {
				this.ssp.enable(() => this.emit('ready'));
			});
			this.ssp.on('read_note', id => {
				if (id > 0) this.emit('read', { id, ...notes[id] });
			});
			this.ssp.on('credit_note', id => {
				if (id > 0) this.emit('accepted', { id, ...notes[id] });
			});
		});
	}
	close() {
		if (this.ssp.port && this.ssp.port.isOpened) this.ssp.disable();
	}
}
