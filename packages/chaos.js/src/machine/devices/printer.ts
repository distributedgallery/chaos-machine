import SerialPort from 'serialport'
import QRCode from 'qrcode'
import ThPrinter from 'thermalprinter'
import EventEmitter from 'events'

export default class Printer extends EventEmitter {
	public serialPort: SerialPort
	public printer:		ThPrinter

	constructor(opts) {
		super();
		if (!opts.port) throw new Error('[Printer] Please specify a serial port!');
		this.serialPort = new SerialPort(opts.port, {
			baudRate: 19200,
		});
		this.serialPort.on('open', () => {
			this.printer = new ThPrinter(this.serialPort);
			this.printer.on('ready', () => this.emit('ready'));
		});
	}

	print(text) {
		QRCode.toString(text, (err, result) => {
			const lines = result.split('\n');
			this.printer.setLineSpacing(0);
			this.printer.center();
			lines.forEach(line => this.printer.printLine(line.substring(2, line.length - 2)));
			this.printer.writeCommands([27, 50]);
			this.printer.lineFeed(2);
			this.printer.print(() => this.emit('done', text));
		});
	}

	close() {
		if (this.serialPort && this.serialPort.isOpened) this.serialPort.close();
	}
}
