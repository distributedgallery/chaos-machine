import EventEmitter from 'events'
import Lcd from 'lcd'
import os from 'os'

export default class LCD extends EventEmitter {
  public lcd?: Lcd

  constructor(opts) {
    super()

    if (!opts.rs || !opts.e || !opts.data || opts.data.length !== 4) {
      throw new Error('[Lcd] Please specifiy the correct pins')
    }
    this.lcd = new Lcd(opts)
    this.lcd.on('ready', () => this.emit('ready'))
  }

  public write(text, cb) {
    this.lcd.clear((err, result) => {
      setTimeout(() => {
        this.lcd.print(text, (error) => cb && cb(error))
      }, 200)
    })
  }

  public close() {
    if (this.lcd) {
      this.lcd.clear((err, result) => this.lcd.close())
    }
  }
}
