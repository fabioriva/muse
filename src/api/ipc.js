const electron = window.require('electron')
const ipcRenderer = electron.ipcRenderer

export default {
  on (channel, listener) {
    ipcRenderer.on(channel, listener)
  },
  send (channel, args) {
    ipcRenderer.send(channel, args)
  }
}
