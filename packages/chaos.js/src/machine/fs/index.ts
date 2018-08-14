import nodeFS from 'fs'

const fs = {
  write: (path: string, buffer: any) => {
    nodeFS.writeFileSync(path, buffer)
  },

  exists: (path: string): boolean => {
    return nodeFS.existsSync(path)
  },

  mkdir: (path: string) => {
    return nodeFS.mkdirSync(path)
  }
}

export default fs
