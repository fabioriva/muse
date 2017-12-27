/**
 * Electron.
 */
const electron = require('electron')
const {ipcMain} = electron
const {dialog} = electron
/**
 * Event Emitter.
 */
const EventEmitter = require('events')
class S7Emitter extends EventEmitter {}
const s7Emitter = new S7Emitter()
/**
 * S7 comm.
 */
const async = require('async')
const snap7 = require('node-snap7')
const s7client = new snap7.S7Client()
const s7comm = require('./s7comm')
const s7def = require('./s7def')
const S7Log = require('./S7Log')
const s7utils = require('./s7utils')
const PLC = {
  ip: '140.80.49.2',
  rack: 0,
  slot: 1
}
const alarms = require('./alarms')
const models = require('./models')

function createApplication (window) {
  async.retry({
    times: 5,
    interval: 1000
  }, s7comm.commOpen.bind(this, PLC, s7client), (err, isOnline) => {
    if (err) return s7comm.commError(err, PLC, s7client)
    PLC.isOnline = isOnline
    // alarms
    ipcMain.on('alarms', (event, arg) => {
      updateAlarms(PLC, alarms, function (results) {
        window.webContents.send('alarms', JSON.stringify(alarms.alarms))
      })
    })
    // cards
    ipcMain.on('cards', (event, arg) => {
      s7client.ReadArea(0x84, s7def.DB_CARDS, s7def.DB_CARDS_INIT, s7def.DB_CARDS_LEN, 0x02, function (err, s7data) {
        if (err) return s7comm.commError(err, PLC, s7client)
        s7utils.updateCards(0, s7data, models.cards, function (results) {
          window.webContents.send('cards', JSON.stringify(models.cards))
        })
      })
    })
    ipcMain.on('card-edit', (event, arg) => {
      const { card, code, timeFrom, timeTo } = arg
      const regexp = new RegExp('^[a-fA-F0-9]{3}$')
      console.log(code, regexp.test(code.value))
      if (regexp.test(code.value)) {
        const buffer = Buffer.alloc(12).fill(0)
        buffer.writeUInt16BE(card.value, 0)
        buffer.writeUInt16BE(parseInt(code.value, 16), 2)
        buffer.writeUInt32BE(s7utils.setPLCTime(timeFrom.value), 4)
        buffer.writeUInt32BE(s7utils.setPLCTime(timeTo.value), 8)
        s7client.WriteArea(0x84, s7def.DB_DATA, s7def.CARD_INDEX_INIT, 12, 0x02, buffer, (err) => {
          if (err) return s7comm.commError(err, PLC, s7client)
          // window.webContents.send('log', html)
        })
      } else {
        dialog.showErrorBox('Card Edit', `Error: pin code ${code.value} is not valid.`)
        window.webContents.send('cards', JSON.stringify(models.cards))
      }
    })
    // map
    ipcMain.on('map', (event, arg) => {
      s7client.ReadArea(0x84, s7def.DB_MAP, s7def.DB_MAP_INIT, s7def.DB_MAP_LEN, 0x02, function (err, s7data) {
        if (err) return s7comm.commError(err, PLC, s7client)
        s7utils.updateMap(0, s7data, models.stalls, models.map.statistics, function (results) {
          window.webContents.send('map', JSON.stringify(models.map))
        })
      })
    })
    ipcMain.on('map-edit', (event, arg) => {
      let card = arg.value
      let stall = models.stalls.find(s7utils.mapFind.bind(this, card))
      if (stall) {
        dialog.showErrorBox('Map Edit', `Error: card ${card} in use`)
      } else {
        const buffer = Buffer.alloc(4)
        buffer.writeUInt16BE(arg.stall, 0)
        buffer.writeUInt16BE(arg.value, 2)
        s7client.WriteArea(0x84, s7def.DB_DATA, s7def.MAP_INDEX_INIT, 4, 0x02, buffer, (err) => {
          if (err) return s7comm.commError(err, PLC, s7client)
          // window.webContents.send('log', html)
        })
      }
    })
    ipcMain.on('delete-queue-n', (event, arg) => {
      console.log('delete-queue-n')
      const buffer = Buffer.alloc(1, 1, 'hex')
      s7client.WriteArea(0x83, 0, ((28 * 8) + arg.index), 1, 0x01, buffer, (err) => {
        if (err) return s7comm.commError(err, PLC, s7client)
      })
    })
    ipcMain.on('mode-change', (event, arg) => {
      console.log('mode-change', arg)
      const buffer = Buffer.alloc(2)
      buffer.writeUInt16BE(arg.value, 0)
      s7client.WriteArea(0x84, s7def.DB_DATA, 46, 2, 0x02, buffer, (err) => {
        if (err) return s7comm.commError(err, PLC, s7client)
        // window.webContents.send('log', html)
      })
    })
    async.forever(function (next) {
      window.webContents.send('comm', JSON.stringify(PLC))
      if (PLC.isOnline) {
        window.webContents.send('diag', JSON.stringify({ alarmCount: alarms.alarms.count, isActive: alarms.alarms.count > 0 }))
        async.waterfall([
          function (callback) {
            s7client.ReadArea(0x84, s7def.DB_DATA, s7def.DB_DATA_INIT, s7def.DB_DATA_LEN, 0x02, function (err, s7data) {
              if (err) return callback(s7comm.commError(err, PLC, s7client))
              s7utils.updateData(s7data, models, function (results) {
                window.webContents.send('overview', JSON.stringify(models.overview))
                window.webContents.send('racks', JSON.stringify(models.racks))
                callback(null, s7data)
              })
            })
          },
          function (s7data, callback) {
            if (s7data[0] === 0x02 && s7data[31] === 0x03) {
              var s7log = new S7Log(s7data.slice(0, 32))
              s7Emitter.emit('log', s7log)
              callback(null, s7log)
            } else {
              callback(1) // exit to main callback
            }
          },
          function (s7log, callback) {
            var start = 0
            switch (s7log.operation) {
              case 1:
              case 2:
                updateAlarms(PLC, alarms, function (results) {
                  window.webContents.send('alarms', JSON.stringify(alarms.alarms))
                  callback(null, s7log)
                })
                break
              case 4:
                start = (s7log.card - 1) * s7def.CARD_LEN
                s7client.ReadArea(0x84, s7def.DB_CARDS, start, s7def.CARD_LEN, 0x02, function (err, s7data) {
                  if (err) return callback(s7comm.commError(err, PLC, s7client))
                  s7utils.updateCards(start, s7data, models.cards, function (results) {
                    window.webContents.send('cards', JSON.stringify(models.cards))
                    callback(null, s7log)
                  })
                })
                break
              case 5:
              case 6:
              case 7:
              case 8:
                start = (s7log.stall - 1) * s7def.STALL_LEN
                s7client.ReadArea(0x84, s7def.DB_MAP, start, s7def.STALL_LEN, 0x02, function (err, s7data) {
                  if (err) return callback(s7comm.commError(err, PLC, s7client))
                  s7utils.updateMap(start, s7data, models.stalls, models.map.statistics, function (results) {
                    window.webContents.send('map', JSON.stringify(models.map))
                    // let stall = models.stalls.find(s7utils.mapFind.bind(this, s7log.card))
                    // if (s7log.operation === 6 && stall) {
                    //   printer.printExitTicket(stall.card, stall.date)
                    // }
                    callback(null, s7log)
                  })
                })
                break
              default:
                callback(null, s7log)
            }
          },
          function (s7log, callback) {
            s7client.WriteArea(0x84, s7def.DB_DATA, 0, 32, 0x02, Buffer.alloc(32).fill(0), function (err) {
              if (err) return callback(s7comm.commError(err, PLC, s7client))
              callback(null, s7client.ExecTime())
            })
          }
        ], function (err, result) {
          if (err) console.log(`${err} async waterfall main callback Execution time ${s7client.ExecTime()} msec >> ${PLC.ip}`)
          setTimeout(() => {
            next()
          }, 500)
        })
      } else {
        setTimeout(() => {
          PLC.isOnline = s7client.Connect()
          console.log(`connecting to ${PLC.ip} ... ${PLC.isOnline}`)
          next()
        }, 500)
      }
    })
  })
  ipcMain.on('history', (event, arg) => {
    s7Emitter.emit('query-log', event, arg)
  })
  ipcMain.on('cards', (event, arg) => {
    window.webContents.send('cards', JSON.stringify(models.cards))
  })
  ipcMain.on('map', (event, arg) => {
    window.webContents.send('map', JSON.stringify(models.map))
  })
  ipcMain.on('overview', (event, arg) => {
    window.webContents.send('overview', JSON.stringify(models.overview))
  })
  ipcMain.on('rack', (event, arg) => {
    window.webContents.send('racks', JSON.stringify(models.racks))
  })
}

exports = module.exports = createApplication
exports.s7Emitter = s7Emitter

function updateAlarms (PLC, models, done) {
  async.series([
    (callback) => {
      readAlarms(PLC, s7def.DB_ALARM_1, models.al_1, models.alarms.groups[0], function (iterations) {
        callback(null, iterations)
      })
    },
    (callback) => {
      readAlarms(PLC, s7def.DB_ALARM_2, models.al_1, models.alarms.groups[1], function (iterations) {
        callback(null, iterations)
      })
    },
    (callback) => {
      readAlarms(PLC, s7def.DB_ALARM_3, models.al_2, models.alarms.groups[2], function (iterations) {
        callback(null, iterations)
      })
    },
    (callback) => {
      readAlarms(PLC, s7def.DB_ALARM_4, models.al_2, models.alarms.groups[3], function (iterations) {
        callback(null, iterations)
      })
    }
  ],
  (err, res) => {
    if (err) console.log(err)
    models.alarms.count = models.alarms.groups[0].count +
                          models.alarms.groups[1].count +
                          models.alarms.groups[2].count +
                          models.alarms.groups[3].count
    done(res)
  })
}

function readAlarms (PLC, db, alarms, group, callback) {
  s7client.ReadArea(0x84, db, s7def.DB_ALARM_INIT, s7def.DB_ALARM_LEN, 0x02, function (err, s7data) {
    if (err) return s7comm.commError(err, PLC, s7client)
    s7utils.updateAlarms(0, s7data, alarms, group, function (err, iterations) {
      if (err) console.log(err)
      // console.log(`(${db}) ------------>`, iterations)
      callback(null, iterations)
    })
  })
}
