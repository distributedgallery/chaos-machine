"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const qrcode_1 = __importDefault(require("qrcode"));
const thermalprinter_1 = __importDefault(require("thermalprinter"));
const events_1 = __importDefault(require("events"));
class Printer extends events_1.default {
    constructor(opts) {
        super();
        if (!opts.port)
            throw new Error('[Printer] Please specify a serial port!');
        this.serialPort = new serialport_1.default(opts.port, {
            baudRate: 19200,
        });
        this.serialPort.on('open', () => {
            this.printer = new thermalprinter_1.default(this.serialPort);
            this.printer.on('ready', () => this.emit('ready'));
        });
    }
    print(text) {
        qrcode_1.default.toString(text, (err, result) => {
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
        if (this.serialPort && this.serialPort.isOpened)
            this.serialPort.close();
    }
}
exports.default = Printer;
