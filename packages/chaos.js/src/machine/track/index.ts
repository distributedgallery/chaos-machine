import path from 'path'
import Machine from '../'

export default class Track {
  public machine: any

  constructor(machine: Machine) {
    this.machine = machine
  }

  public path(hash: string): string {
    return path.join(this.machine.paths.tracks, hash)
  }

  public exists(hash: string): boolean {
    return this.machine.fs.exists(path.join(this.machine.paths.tracks, hash))
  }

  public async download(hash: string) {
    this.machine.log.info('Downloading', { hash })
    const buffer = await this.machine.ipfs.files.cat(hash)
    this.machine.fs.write(this.path(hash), buffer)
    this.machine.log.info('Downloaded', { hash })

  }
}
