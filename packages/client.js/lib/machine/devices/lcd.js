"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const events_1 = __importDefault(require("events"));
const lcd_1 = __importDefault(require("lcd"));
class LCD extends events_1.default {
    constructor(opts) {
        super();
        if (!opts.rs || !opts.e || !opts.data || opts.data.length !== 4) {
            throw new Error('[Lcd] Please specifiy the correct pins');
        }
        this.opts = opts;
        this.lcd = new lcd_1.default(opts);
        this.lcd.on('ready', () => {
            this.lcd.setCursor(0, 0);
            this.lcd.noCursor();
            this.emit('ready');
        });
    }
    write(text) {
        this.lcd = new lcd_1.default(this.opts);
        this.lcd.on('ready', () => {
            this.lcd.setCursor(0, 0);
            this.lcd.noCursor();
            this.lcd.clear((err) => {
                this.lcd.print(text);
            });
        });
    }
    close() {
        this.lcd.clear((err) => this.lcd.close());
    }
}
module.exports = LCD;
