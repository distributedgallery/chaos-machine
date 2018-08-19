"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serialport_1 = __importDefault(require("serialport"));
const qrcode_1 = __importDefault(require("qrcode"));
const thermalprinter_1 = __importDefault(require("thermalprinter"));
const events_1 = __importDefault(require("events"));
const node_url_shortener_1 = __importDefault(require("node-url-shortener"));
class Printer extends events_1.default {
    constructor(opts) {
        super();
        if (!opts.port)
            throw new Error('[Printer] Please specify a serial port');
        this.serialPort = new serialport_1.default(opts.port, {
            baudRate: 19200,
        });
        this.serialPort.on('open', () => {
            this.printer = new thermalprinter_1.default(this.serialPort);
            this.printer.on('ready', () => this.emit('ready'));
        });
    }
    print(text) {
        const self = this;
        self.printer.setLineSpacing(0);
        self.printer.center();
        qrcode_1.default.toString(text, (err, result) => {
            if (err) {
                throw new Error('[QRCode] ' + err.msg);
            }
            const lines = result.split('   \n   ');
            lines.forEach(line => {
                line.length && self.printer.printLine(line);
            });
            self.printer.writeCommands([27, 50]);
            self.printer.lineFeed(10);
            self.printer.print(() => self.emit('done', text));
        });
    }
    printShort(text) {
        const self = this;
        self.printer.setLineSpacing(0);
        self.printer.center();
        node_url_shortener_1.default.short(text, (err, url) => {
            if (err) {
                throw new Error('[Shortener] ' + err.msg);
            }
            qrcode_1.default.toString(url, (err, result) => {
                if (err) {
                    throw new Error('[QRCode] ' + err.msg);
                }
                const lines = result.split('   \n   ');
                lines.forEach(line => {
                    line.length && self.printer.printLine(line);
                });
                self.printer.printText(url);
                self.printer.writeCommands([27, 50]);
                self.printer.lineFeed(10);
                self.printer.print(() => self.emit('done', text));
            });
        });
    }
    close() {
        if (this.serialPort && this.serialPort.isOpened)
            this.serialPort.close();
    }
}
exports.default = Printer;
