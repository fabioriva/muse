/**
 * sqlite3
 */
const sqlite3 = require('sqlite3').verbose()
const DB_NAME = 'muse.db'
const db = new sqlite3.cached.Database(DB_NAME) // ':memory:')

const strings = require('./strings')
const moment = require('moment')

const CREATE_HISTORY = `CREATE TABLE IF NOT EXISTS history (
  INTEGER PRIMARY_KEY,
  device TEXT NOT NULL,
  mode TEXT NOT NULL,
  card INTEGER,
  stall INTEGER,
  size INTEGER,
  alarm INTEGER,
  info TEXT,
  operation INTEGER,
  date INTEGER NOT NULL
)`

db.run(CREATE_HISTORY)

module.exports = {
  saveLog: function (s7log, done) {
    switch (s7log.stx) {
      case 0x264:
        var log = {
          device: returnString(strings.devices, s7log.device),
          mode: returnString(strings.modes, s7log.mode),
          card: s7log.card,
          stall: s7log.stall,
          size: s7log.size,
          alarm: s7log.alarm,
          info: s7log.alarm !== 0 ? returnAlarm(s7log.alarm, s7log.device) : returnString(strings.operations, s7log.operation),
          operation: s7log.operation,
          date: s7log.date
        }
        var stmt = db.prepare('INSERT INTO history (device, mode, card, stall, size, alarm, info, operation, date) VALUES (?,?,?,?,?,?,?,?,?)')
        stmt.run(
          returnString(strings.devices, s7log.device),
          returnString(strings.modes, s7log.mode),
          s7log.card,
          s7log.stall,
          s7log.size,
          s7log.alarm,
          s7log.alarm !== 0 ? returnAlarm(s7log.alarm, s7log.device) : returnString(strings.operations, log.operation),
          s7log.operation,
          moment(s7log.date).format('YYYY-MM-DD HH:mm:ss')
        )
        stmt.finalize()
        // done(null, notificationLog(log))
        done(null, log)
        break
      case 0x26d:
        break
    }
  },
  queryLog: function (items, page, dateFrom, dateTo, filter, done) {
    // console.log(typeof moment(dateFrom).format('YYYY-MM-DDTHH:mm:ss'), moment(dateFrom).format('YYYY-MM-DD HH:mm:ss'), typeof moment(dateTo).format('YYYY-MM-DDTHH:mm:ss'), moment(dateTo).format('YYYY-MM-DD HH:mm:ss'))
    dateFrom = moment(dateFrom).format('YYYY-MM-DD HH:mm:ss')
    dateTo = moment(dateTo).format('YYYY-MM-DD HH:mm:ss')
    let query
    switch (filter) {
      case 'b':
        query = 'SELECT * FROM history WHERE date >= ? AND date <= ? AND alarm != 0 ORDER BY _ROWID_ DESC'
        break
      default:
        query = 'SELECT * FROM history WHERE date >= ? AND date <= ? ORDER BY _ROWID_ DESC'
    }
    db.all('SELECT COUNT(*) AS count FROM history WHERE date >= ? AND date <= ?', [dateFrom, dateTo], (err, rows) => {
      if (err) console.log(err)
      var count = rows[0].count
      var currentPage = Number.isInteger(parseInt(page)) ? parseInt(page) : 1
      var itemsPerPage = items // 25
      var startIndex = (currentPage - 1) * itemsPerPage
      var totalItems = count
      var totalPages = Math.ceil(totalItems / itemsPerPage)
      var nextPage = currentPage < totalPages ? currentPage + 1 : totalPages
      var prevPage = currentPage > 1 ? currentPage - 1 : 1
      // var rows
      // db.all('SELECT * FROM history WHERE date >= ? AND date <= ? ORDER BY _ROWID_ DESC LIMIT ?, ?', [dateFrom, dateTo, startIndex, itemsPerPage], (err, rows) => {
      db.all(query, [dateFrom, dateTo], (err, rows) => {
        if (err) console.log(err)
        done({
          rows: rows,
          dateFrom: dateFrom, // moment(dateFrom).format('YYYY-MM-DDTHH:mm:ss'),
          dateTo: dateTo,     // moment(dateTo).format('YYYY-MM-DDTHH:mm:ss'),
          currentPage: currentPage,
          nextPage: nextPage,
          prevPage: prevPage,
          totalItems: totalItems,
          totalPages: totalPages
        })
      })
    })
  }
}

// function notificationLog (log) {
//   let message = log.device
//   let description = `<strong>${moment(log.date).format('YYYY-MM-DD HH:mm:ss')}</strong>`
//   console.log(message, description)
//   switch (log.operation) {
//     case 1: // Alarm In
//       description += `<span>${log.info} ID ${log.alarm}</span>`
//       return { type: 'ERROR', message: message, description: description }
//     case 2: // Alarm Out
//       description += `<span>${log.info} ID ${log.alarm}</span>`
//       return { type: 'SUCCESS', message: message, description: description }
//     case 3: // Mode switch
//       return { type: 'WARNING', message: message, description: description }
//     case 4: // Edit code
//       return { type: 'WARNING', message: message, description: description }
//     case 5: // Map In
//     case 6: // Map Out
//     case 7: // Shuffle In
//     case 8: // Shuffle Out
//       return { type: 'SUCCESS', message: message, description: description }
//     default:
//       return { type: 'INFO', message: message, description: description }
//   }
// }

// function htmlLog (msg) {
//   var date = new Date(msg.date)
//   var html = `[${formatDate(date)}][${formatTime(date)}] [${msg.device}] `
//   var type = 'INFO'
//   switch (msg.operation) {
//     case 1: // Alarm In
//       html += `${msg.info} ID ${msg.alarm}`
//       type = 'ERROR'
//       break
//     case 2: // Alarm Out
//       html += `${msg.info} ID ${msg.alarm}`
//       type = 'SUCCESS'
//       break
//     case 3: // Mode switch
//       html += `${msg.info} to ${msg.mode}`
//       type = 'WARNING'
//       break
//     case 4: // Edit code
//       html += `${msg.info} card ${msg.card}`
//       type = 'WARNING'
//       break
//     case 5: // Map In
//     case 6: // Map Out
//     case 7: // Shuffle In
//     case 8: // Shuffle Out
//       html += `${msg.info} ${msg.stall} card ${msg.card}`
//       type = 'SUCCESS'
//       break
//     default:
//       html += `${msg.info}`
//       type = 'INFO'
//   }
//   console.log(type, html)
//   return {type: type, html: html}
// }

// function htmlLog (msg) {
//   var date = new Date(msg.date)
//   var html = `<span>[${formatDate(date)}]&nbsp;[${formatTime(date)}]&nbsp;[${msg.device}]&nbsp;<span className"fa fa-angle-double-right"></span>&nbsp</span>`
//   switch (msg.operation) {
//     case 1: // Alarm In
//     case 2: // Alarm Out
//       html += `<span>${msg.info}&nbspID&nbsp${msg.alarm}</span>`
//       break
//     case 3: // Mode switch
//       html += `<span>${msg.info}&nbspto&nbsp${msg.mode}</span>`
//       break
//     case 4: // Edit code
//       html += `<span>${msg.info}&nbspcard&nbsp${msg.card}</span>`
//       break
//     case 5: // Map In
//     case 6: // Map Out
//     case 7: // Shuffle In
//     case 8: // Shuffle Out
//       html += `<span>${msg.info}&nbsp${msg.stall}&nbspcard&nbsp${msg.card}</span>`
//       break
//     default:
//       html += `<span>${msg.info}&nbsp</span>`
//   }
//   return html
// }

function returnString (a, index) {
  return (index) < a.length ? a[index] : ''
}

function returnAlarm (index, device) {
  switch (device) {
    case 1:
    case 2:
      return returnString(strings.alarms, index)
    case 3:
    case 4:
      return returnString(strings.alarms, index)
  }
}

function formatDate (date) {
  return date.getFullYear() + '-' + addZeroBefore(date.getMonth() + 1) + '-' + addZeroBefore(date.getDate())
}

function formatTime (date) {
  return addZeroBefore(date.getHours()) + ':' + addZeroBefore(date.getMinutes()) + ':' + addZeroBefore(date.getSeconds()) + ':' + addDoubleZeroBefore(date.getMilliseconds())
}

function addZeroBefore (n) {
  return (n < 10 ? '0' : '') + n
}

function addDoubleZeroBefore (n) {
  if (n < 10) {
    return '00' + n
  } else {
    return (n < 100 ? '0' : '') + n
  }
}
