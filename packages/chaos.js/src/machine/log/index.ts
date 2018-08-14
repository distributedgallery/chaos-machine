import Machine from '../'
import fs      from 'fs'
import path    from 'path'

export default class Log {
  public machine: any

  constructor(machine: Machine) {
    this.machine = machine
  }

  public info(message: string) {
    const line = '[' + new Date(Date.now()).toISOString() + ']' + message
    console.log(line)
    fs.appendFile(this.machine.paths['log'], line + '\n', (err) => {
      if (err) {
        this.error('[log]' + message)
      }
    })
  }

  public error(message: string) {
    const line = '[' + new Date(Date.now()).toISOString() + ']' + '[error]' + message
    console.log(line)
    fs.appendFile(this.machine.paths['log'], line + '\n', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }

}
