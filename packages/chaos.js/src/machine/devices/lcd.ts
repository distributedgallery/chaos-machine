import EventEmitter from 'events'
import Lcd from 'lcd'
import os from 'os'

class LCD extends EventEmitter {
  public lcd?: Lcd
  public opts: any

  constructor(opts) {
    super()

    if (!opts.rs || !opts.e || !opts.data || opts.data.length !== 4) {
      throw new Error('[Lcd] Please specifiy the correct pins')
    }
    this.opts = opts
    this.lcd  = new Lcd(opts)
    this.lcd.on('ready', () => {
      this.lcd.setCursor(0, 0)
      this.lcd.noCursor()
      this.emit('ready')
    })
  }

  public write(text) {
    this.lcd  = new Lcd(this.opts)
    this.lcd.on('ready', () => {
      this.lcd.setCursor(0, 0)
      this.lcd.noCursor()
      this.lcd.clear((err) => {
        this.lcd.print(text)
      })
    })
  }

  public close() {
    this.lcd.clear((err) => this.lcd.close())
  }
}

export = LCD
