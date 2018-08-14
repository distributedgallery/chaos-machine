import Machine from '../'
import fs      from 'fs'
import path    from 'path'

export default class Log {
  public machine: any

  constructor(machine: Machine) {
    this.machine = machine
  }

  public info(message: string) {
    const line = '[' + new Date(Date.now()).toISOString() + ']' + message + '\n'
    console.log(line)
    fs.appendFile(this.machine.paths['log'], line, (err) => {
      if (err) {
        this.error(message)
      }
    })
  }

  public error(message: string) {
    const line = '[' + new Date(Date.now()).toISOString() + ']' + '[error]' + message + '\n'
    console.log(line)
    fs.appendFile(this.machine.paths['log'], line, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }

}
