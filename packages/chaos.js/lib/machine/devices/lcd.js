"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lcd_1 = __importDefault(require("lcd"));
const events_1 = __importDefault(require("events"));
class LCD extends events_1.default {
    constructor(opts) {
        super();
        if (!opts.rs || !opts.e || !opts.data || opts.data.length !== 4) {
            throw new Error('[Lcd] Please specifiy the correct pins');
        }
        this.lcd = new lcd_1.default(opts);
        this.lcd.on('ready', () => this.emit('ready'));
    }
    write(text, cb) {
        // this.lcd.setCursor(0, 0);
        this.lcd.clear((err, result) => {
            this.lcd.print(text, err => cb && cb(err));
        });
    }
    close() {
        if (this.lcd) {
            this.lcd.clear((err, result) => this.lcd.close());
        }
    }
}
exports.default = LCD;
