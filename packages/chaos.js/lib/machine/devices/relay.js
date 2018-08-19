"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onoff = require("onoff");
var Gpio = onoff.Gpio;
class Relay {
    constructor(opts) {
        if (!opts.pin)
            throw new Error('[Relay] Please specify a pin!');
        if (Gpio.accessible) {
            this.gpio = new Gpio(opts.pin, 'out');
            this.turnOff();
        }
        else {
            this.gpio = {
                writeSync: value => console.log(`writing: ${value}`),
                unexport: () => console.log(`unexporting`),
            };
        }
    }
    turnOn() {
        this.gpio.writeSync(0);
    }
    turnOff() {
        this.gpio.writeSync(1);
    }
    close() {
        if (Gpio.accessible)
            this.gpio.unexport();
    }
}
exports.default = Relay;
