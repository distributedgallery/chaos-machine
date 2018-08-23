import nodeFS from 'fs'

const fs = {
  exists: (path: string): boolean => {
    return nodeFS.existsSync(path)
  },
  mkdir: (path: string) => {
    return nodeFS.mkdirSync(path)
  },
  write: (path: string, buffer: any) => {
    nodeFS.writeFileSync(path, buffer)
  }
}

export default fs
