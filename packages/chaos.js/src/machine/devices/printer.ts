import EventEmitter from 'events'
import shorten from 'node-url-shortener'
import QRCode from 'qrcode'
import SerialPort from 'serialport'
import ThPrinter from 'thermalprinter'

export default class Printer extends EventEmitter {
  public serialPort: SerialPort
  public printer: ThPrinter

  constructor(opts) {
    super()

    if (!opts.port) { throw new Error('[Printer] Please specify a serial port') }
    this.serialPort = new SerialPort(opts.port, { baudRate: 19200 })
    this.serialPort.on('open', () => {
      this.printer = new ThPrinter(this.serialPort)
      this.printer.on('ready', () => this.emit('ready'))
    })
  }

  public print(text: string) {
    const self = this

    self.printer.setLineSpacing(0)
    self.printer.center()

    QRCode.toString(text, (err, result) => {
      if (err) { throw new Error('[QRCode] ' + err.msg) }
      const lines = result.split('   \n   ')
      lines.forEach((line) => {
        self.printer.printLine(line)
      })
      self.printer.writeCommands([27, 50])
      self.printer.lineFeed(10)
      self.printer.print(() => self.emit('done', text))
    })
  }

  public printShort(text: string) {
    const self = this

    self.printer.setLineSpacing(0)
    self.printer.center()

    shorten.short(text, (err, url) => {
      if (err) { throw new Error('[Shortener] ' + err.msg) }
      QRCode.toString(url, (error, result) => {
        if (err) { throw new Error('[QRCode] ' + error.msg) }
        const lines = result.split('   \n   ')
        lines.forEach((line) => {
          self.printer.printLine(line)
        })
        self.printer.printText(url)
        self.printer.writeCommands([27, 50])
        self.printer.lineFeed(5)
        self.printer.print(() => self.emit('done', text))
      })
    })
  }

  public close() {
    if (this.serialPort && this.serialPort.isOpened) { this.serialPort.close() }
  }
}
