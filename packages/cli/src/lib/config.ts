import fs from 'fs'
import json from 'jsonfile'
import os from 'os'
import npath from 'path'

export const dir = npath.join(os.homedir(), '.chaos')
export const path = npath.join(dir, 'config.json')

export const init = () => {
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  save({})
}

export const exists = (): boolean => {
  return fs.existsSync(dir) && fs.existsSync(path)
}

export const save = (data: any) => {
  return json.writeFileSync(path, data)
}

export const load = (): any => {
  return json.readFileSync(path)
}
