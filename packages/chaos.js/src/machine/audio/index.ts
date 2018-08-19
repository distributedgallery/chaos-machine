import Machine from '../'
import player from 'sound-player'
import processExists from 'process-exists'

export default class Audio {
  public machine: Machine
  public player: any

  constructor(machine: Machine) {
    this.machine = machine
    this.player = new player({ player: 'mpg123', filename: '' })
  }

  public async shuffle(): Promise<string> {
    const hash = await this.machine.contract.shuffle()
    this.machine.log.info('Shuffling', { track: hash })
    this.play(hash)
    return hash
  }

  public async play(hash: string) {
    if (!this.machine.track.exists(hash)) { await this.machine.track.download(hash) }
    if (typeof this.player.process !== 'undefined' && await processExists(this.player.process.pid)) {
      process.kill(this.player.process.pid)
    }
    this.machine.log.info('Playing', { track: hash })
    this.player.play({ player: 'mpg123', filename: this.machine.track.path(hash) })
  }
}
