import Machine from '../'
import player from 'sound-player'


export default class Audio {
  public machine: Machine
  public player:  any

  constructor(machine: Machine) {
    this.machine = machine
    this.player  = new player({ player: 'mpg123', filename: '' })
  }

  public async shuffle(): Promise<string> {
    const hash = await this.machine.contract.shuffle()
    this.machine.log.info('[shuffle][' + hash + ']')
    this.play(hash)
    return hash
  }

  public async play(hash: string) {
    if (!this.machine.track.exists(hash)) { await this.machine.track.download(hash) }
    if (this.player.process) { process.kill(this.player.process.pid) }

    this.machine.log.info('[playing][' + hash + ']')
    this.player.play({ player: 'mpg123', filename: this.machine.track.path(hash) })
  }
}
