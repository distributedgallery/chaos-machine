"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onoff_1 = require("onoff");
class Relay {
    constructor(opts) {
        if (!opts.pin)
            throw new Error('[Relay] Please specify a pin!');
        if (onoff_1.Gpio.accessible)
            this.gpio = new onoff_1.Gpio(opts.pin, 'out');
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
        if (onoff_1.Gpio.accessible)
            this.gpio.unexport();
    }
}
exports.default = Relay;
