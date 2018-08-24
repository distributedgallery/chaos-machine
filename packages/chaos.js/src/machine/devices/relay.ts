import onoff = require('onoff')
import Gpio  = onoff.Gpio

class Relay {
  public gpio: any

  constructor(opts) {
    if (!opts.pin) { throw new Error('[Relay] Please specify a pin!') }

    if (Gpio.accessible) {
      this.gpio = new Gpio(opts.pin, 'out')
      this.turnOff()
    }
  }

  public turnOn() {
    this.gpio.writeSync(0)
  }

  public turnOff() {
    this.gpio.writeSync(1)
  }

  public close() {
    if (Gpio.accessible) { this.gpio.unexport() }
  }
}

export = Relay
