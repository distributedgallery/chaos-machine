"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ssp_1 = __importDefault(require("@xavier.seignard/ssp"));
const events_1 = __importDefault(require("events"));
const notes = {
    1: { value: 5, display: '5€' },
    2: { value: 10, display: '10€' },
    3: { value: 20, display: '20€' },
    4: { value: 50, display: '50€' },
    5: { value: 100, display: '100€' },
    6: { value: 500, display: '500€' }
};
class Cash extends events_1.default {
    constructor(opts) {
        super();
        if (!opts.port) {
            throw new Error('[Cash] Please specify a serial port!');
        }
        this.opts = opts;
        this.ssp = new ssp_1.default({
            currencies: [1, 1, 1, 1, 1, 1],
            device: this.opts.port,
            type: 'nv10usb'
        });
        this.ssp.on('error', (err) => {
            this.ssp.init(true, (error, res) => { });
        });
        this.ssp.init(true, () => {
            this.ssp.on('ready', () => {
                this.ssp.enable(() => this.emit('ready'));
            });
            this.ssp.on('read_note', (id) => {
                if (id > 0) {
                    this.emit('read', Object.assign({ id }, notes[id]));
                }
            });
            this.ssp.on('credit_note', (id) => {
                if (id > 0) {
                    this.emit('accepted', Object.assign({ id }, notes[id]));
                }
            });
        });
    }
    close() {
        if (this.ssp.port && this.ssp.port.isOpened) {
            this.ssp.disable();
        }
    }
}
exports.default = Cash;
