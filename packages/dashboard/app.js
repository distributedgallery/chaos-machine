const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let url = `file://${process.cwd()}/dist/index.html`

app.on('ready', () => {
  let window = new BrowserWindow({ width: 800, height: 600 })
  window.loadURL(url)
})
