const {dialog} = require('electron')
const log = console.log

var s7commOpen = (plc, s7client, callback) => {
  s7client.ConnectTo(plc.ip, plc.rack, plc.slot, function (err) {
    if (err) return callback(err)
    callback(err, true)
  })
}

// exports.commOpen = s7commOpen

var s7commError = (err, plc, s7client) => {
  log(`${plc.ip} >> Error Code # ${err} - ${s7client.ErrorText(err)}`)
  dialog.showErrorBox('PLC comm', `${plc.ip} >> Error Code # ${err}\n${s7client.ErrorText(err)}`)
  if (err === 665420) {
    log(`${plc.ip} >> Disconnect # ${s7client.Disconnect()}`)
    plc.isOnline = false
  }
  return err
}

// exports.commError = s7commError

module.exports = {
  commError: s7commError,
  commOpen: s7commOpen
}
