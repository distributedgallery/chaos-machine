import Machine from '../'
import chalk from 'chalk'
import columnify from 'columnify'
import fs from 'fs'
import path from 'path'

export default class Log {
  public machine: any

  constructor(machine: Machine) {
    this.machine = machine
  }

  public info(event: string, args?: any) {

    const data = [{ level: chalk.green('INFO'), timestamp: '[' + new Date(Date.now()).toISOString() + ']', event: event }]
    const dataRaw = [{ level: 'INFO', timestamp: '[' + new Date(Date.now()).toISOString() + ']', event: event }]

    for (const arg in args) {
      data[0][arg] = chalk.green(arg) + '=' + args[arg]
    }
    for (const arg in args) {
      dataRaw[0][arg] = arg + '=' + args[arg]
    }

    const line = columnify(data, { showHeaders: false, config: { event: { minWidth: 30 } } })
    const lineRaw = columnify(dataRaw, { showHeaders: false, config: { event: { minWidth: 30 } } }) + '\n'

    console.log(line)
    fs.appendFile(this.machine.paths['log'], lineRaw, (err) => {
      if (err) {
        this.error('Log', { error: err })
      }
    })
  }

  public error(event: string, args?: any) {
    const data = [{ level: chalk.red('ERR'), timestamp: '[' + new Date(Date.now()).toISOString() + ']', event: event }]
    const dataRaw = [{ level: 'ERR', timestamp: '[' + new Date(Date.now()).toISOString() + ']', event: event }]

    for (const arg in args) {
      data[0][arg] = chalk.red(arg) + '=' + args[arg]
    }
    for (const arg in args) {
      dataRaw[0][arg] = arg + '=' + args[arg]
    }

    const line = columnify(data, { showHeaders: false, config: { event: { minWidth: 30 } } })
    const lineRaw = columnify(dataRaw, { showHeaders: false, config: { event: { minWidth: 30 } } }) + '\n'

    console.log(line)
    fs.appendFile(this.machine.paths['log'], lineRaw, (err) => {
      if (err) {
        console.log(err)
      }
    })
  }

}
