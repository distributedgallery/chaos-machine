"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var onoff_1 = require("onoff");
var Relay = /** @class */ (function () {
    function Relay(opts) {
        if (!opts.pin)
            throw new Error('[Relay] Please specify a pin!');
        if (onoff_1.Gpio.accessible)
            this.gpio = new onoff_1.Gpio(opts.pin, 'out');
        else {
            this.gpio = {
                writeSync: function (value) { return console.log("writing: " + value); },
                unexport: function () { return console.log("unexporting"); },
            };
        }
    }
    Relay.prototype.turnOn = function () {
        this.gpio.writeSync(1);
    };
    Relay.prototype.turnOff = function () {
        this.gpio.writeSync(0);
    };
    Relay.prototype.close = function () {
        if (onoff_1.Gpio.accessible)
            this.gpio.unexport();
    };
    return Relay;
}());
exports.default = Relay;
