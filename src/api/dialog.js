const { BrowserWindow, dialog } = window.require('electron').remote

export default {
  showMessageBox (type, buttons, title, message, callback) {
    const options = {
      type: type, // "none", "info", "error", "question" or "warning"
      buttons: buttons,
      title: title,
      message: message
    }
    dialog.showMessageBox(BrowserWindow.getFocusedWindow(), options, function (response) {
      callback(response)
    })
  },
  showErrorBox (title, content) {
    dialog.showErrorBox(title, content)
  }
}
