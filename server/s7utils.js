const async = require('async')
const moment = require('moment')
const s7def = require('./s7def')
const strings = require('./strings')
/**
 * Utility functions for Simatic PLC data
 */

const BytesToInt = (b1, b2) => {
  return (b1 << 8) | b2
}

exports.BytesToInt = BytesToInt

const BytesToLong = (b1, b2, b3, b4) => {
  return (b1 << 24) | (b2 << 16) | (b3 << 8) | b4
}

exports.BytesToLong = BytesToLong

const IntToBytes = (i, b) => {
  b[0] = i & 0xFF
  b[1] = (i >> 8) & 0xFF
  return i
}

exports.IntToBytes = IntToBytes

const LongToBytes = (i, b) => {
  b[0] = i & 0xFF
  b[1] = (i >> 8) & 0xFF
  b[2] = (i >> 16) & 0xFF
  b[3] = (i >> 24) & 0xFF
  return i
}

exports.LongToBytes = LongToBytes

var getPLCDateTime = (days, msec) => {
  var h = Math.floor(msec / 3600000)
  var m = Math.floor((msec % 3600000) / 60000)
  var s = Math.floor(((msec % 3600000) % 60000) / 1000)
  var ms = Math.floor(((msec % 3600000) % 60000) % 1000)
  var d = new Date(1990, 0, 1, h, m, s, ms)
  return d.setDate(d.getDate() + days)
}

exports.getPLCDateTime = getPLCDateTime

var setPLCTime = (stime) => {
  var time = moment(stime, ['HH:mm:ss'])  //  .format('HH:mm:ss')
  var h = moment(time).hours()
  var m = moment(time).minutes()
  var s = moment(time).seconds()
  var ms = moment(time).milliseconds()
  console.log('setPLCTime', (h * 3600000) + (m * 60000) + (s * 1000) + ms)
  return (h * 3600000) + (m * 60000) + (s * 1000) + ms
}

exports.setPLCTime = setPLCTime

/**
 * Alarms
 */

// var updateAlarms = (data, models, callback) => {
//   async.series([
//     (callback) => {
//       updateAlarmGroup(0, data, models.al_1, models.alarms.groups[0], function (err, alerts) {
//         callback(err, alerts)
//       })
//     },
//     (callback) => {
//       updateAlarmGroup(256, data, models.al_2, models.alarms.groups[1], function (err, alerts) {
//         callback(err, alerts)
//       })
//     }
//   ], (err, res) => {
//     // console.log(err, res)
//     if (err) return callback(err)
//     models.alarms.count = models.alarms.groups[0].count + models.alarms.groups[1].count + models.alarms.groups[2].count + models.alarms.groups[3].count
//     callback(res)
//   })
// }

// exports.updateAlarms = updateAlarms

var updateAlarmGroup = function (byte, data, alarms, alerts, callback) {
  var iterations = 0
  alerts.count = 0
  alerts.active = []
  var mask = 1
  for (var a = 0; a < alarms.length; a++) {
    alarms[a].status = data[byte + 0] & mask ? 1 : 0
    alarms[a].cancel = data[byte + 0] & (4) ? 1 : 0
    var date = getPLCDateTime(BytesToInt(data[byte + 2], data[byte + 3]), BytesToLong(data[byte + 4], data[byte + 5], data[byte + 6], data[byte + 7]))
    alarms[a].date = moment(date).format('YYYY-MM-DD HH:mm:ss:SSS')
    byte += 8
    if (alarms[a].status) {
      ++alerts.count
      // alerts.active.push(alarms[a])
      alerts.active.push(Object.assign({}, alarms[a]))  // clone object
    }
    if (++iterations === alarms.length) {
      // console.log(iterations, alarms.length, data.length, alerts)
      alerts.active.sort(dateSortAsc)
      callback(null, iterations)
    }
  }
}

exports.updateAlarms = updateAlarmGroup

var dateSortAsc = function (a1, a2) {
  // This is a comparison function that will result in dates being sorted in
  // ASCENDING order. As you can see, JavaScript's native comparison operators
  // can be used to compare dates. This was news to me.
  if (a1.date > a2.date) return 1
  if (a1.date < a2.date) return -1
  return 0
}

/**
 * Cards
 */

const updateCards = (start, buffer, cards, callback) => {
  const OFFSET = s7def.CARD_LEN
  var byte = 0
  var min = start === 0 ? 0 : (start / OFFSET)
  var max = (buffer.length / OFFSET) + min
  var iterations = min
  for (var c = min; c < max; c++) {
    cards[c].code = BytesToInt(buffer[byte + 0], buffer[byte + 1]).toString(16).toUpperCase()
    cards[c].rand = getRandomIntInclusive(256, 4095).toString(16).toUpperCase()
//  cards[c].stat = BytesToInt(buffer[byte + 2], buffer[byte + 3])
    cards[c].from = moment(getPLCDateTime(0, BytesToLong(buffer[byte + 2], buffer[byte + 3], buffer[byte + 4], buffer[byte + 5]))).format('HH:mm:ss')
    cards[c].to = moment(getPLCDateTime(0, BytesToLong(buffer[byte + 6], buffer[byte + 7], buffer[byte + 8], buffer[byte + 9]))).format('HH:mm:ss')
    byte += OFFSET
    if (++iterations === max) {
      console.log(iterations, min, max)
      callback(null, iterations)
    }
  }
}

function getRandomIntInclusive (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

exports.updateCards = updateCards

/**
 * Map
 */

var updateMap = (start, buffer, stalls, statistics, callback) => {
  async.series([
    (callback) => {
      updateStalls(start, buffer, stalls, (err, results) => {
        callback(null, results)
      })
    },
    (callback) => {
      updateStatistics(stalls, statistics, (err, results) => {
        callback(null, results)
      })
    }
  ], (err, res) => {
    if (err) return callback(err)
    callback(buffer)
  })
}

exports.updateMap = updateMap

var updateStalls = (start, buffer, stalls, callback) => {
  const OFFSET = s7def.STALL_LEN
  var byte = 0
  var min = start === 0 ? 0 : (start / OFFSET)
  var max = (buffer.length / OFFSET) + min
  var iterations = min
  for (var s = min; s < max; s++) {
    stalls[s].card = BytesToInt(buffer[byte + 0], buffer[byte + 1])
    var date = getPLCDateTime(BytesToInt(buffer[byte + 2], buffer[byte + 3]), BytesToLong(buffer[byte + 4], buffer[byte + 5], buffer[byte + 6], buffer[byte + 7]))
    stalls[s].date = moment(date).format('YYYY-MM-DD HH:mm:ss')
    stalls[s].size = BytesToInt(buffer[byte + 8], buffer[byte + 9])
    byte += OFFSET
    if (++iterations === max) {
      console.log(iterations, min, max)
      callback(null, iterations)
    }
  }
}

// exports.updateStalls = updateStalls

var updateStatistics = (stalls, statistics, callback) => {
  var iterations = 0
  for (var s = 0; s < statistics.length; s++) {
    mapCount(stalls, statistics[s], s)
    if (++iterations === statistics.length) {
      console.log(iterations, statistics)
      callback(null, iterations)
    }
  }
}

// exports.updateStatistics = updateStatistics

const PAPA = 997  // 65533
const RSVD = 998  // 65534
const LOCK = 999  // 65535

function mapCount (stalls, data, size) {
  data[0].value = data[1].value = data[2].value = 0
  for (var s = 0; s < stalls.length; s++) {
    if (size === 0 || stalls[s].size === size) {
      switch (stalls[s].card) {
        case 0 :
          ++data[0].value
          break
        case LOCK :
          ++data[2].value
          break
        default :
          ++data[1].value
          break
      }
      // ++data.total
    }
  }
}

var mapFind = (scard, stall, index, array) => {
  let card = parseInt(scard)
  return stall.card === card && card !== 0 && card !== 999
}

exports.mapFind = mapFind

/**
 * Data
 */

var updateData = (data, models, callback) => {
  async.series([
    (callback) => {
      updateDevices(s7def.DB_DATA_INIT_DEVICE, data, models.devices, strings.modes, function (results) {
        callback(null, results)
      })
    },
    (callback) => {
      updateMeasures(s7def.DB_DATA_INIT_POS, data, models.measures, function (results) {
        callback(null, results)
      })
    },
    (callback) => {
      updateMotors(s7def.DB_DATA_INIT_MOT, data, models.motors, function (results) {
        callback(null, results)
      })
    },
    (callback) => {
      updateQueue(s7def.DB_DATA_INIT_QUEUE, data, models.overview.exitQueue.queueList, function (results) {
        callback(null, results)
      })
    },
    (callback) => {
      updateBits(s7def.DB_DATA_INIT_AB, data, models.outputs, function (results) {
        callback(null, results)
      })
    },
    (callback) => {
      updateBits(s7def.DB_DATA_INIT_EB, data, models.inputs, function (results) {
        callback(null, results)
      })
    },
    (callback) => {
      updateBits(s7def.DB_DATA_INIT_MB, data, models.merkers, function (results) {
        callback(null, results)
      })
    }
  ], (err, res) => {
    // console.log(err, res)
    if (err) return callback(err)
    callback(res)
  })
}

exports.updateData = updateData

var updateBits = (byte, data, bytes, callback) => {
  var iterations = 0
  for (var b = 0; b < bytes.length; b++) {
    var mask = 1
    for (var i = 0; i < bytes[b].bits.length; i++) {
      bytes[b].bits[i].status = (data[byte] & mask ? 1 : 0)
      mask *= 2
    }
    byte += 1
    if (++iterations === bytes.length) {
      // console.log(iterations, bytes.length)
      callback(null, iterations)
    }
  }
}

exports.updateBits = updateBits

/**
 * Overview
 */

var updateDevices = (byte, data, devices, modes, callback) => {
  var iterations = 0
  for (var d = 0; d < devices.length; d++) {
    devices[d].card = BytesToInt(data[byte + 0], data[byte + 1])
    devices[d].mode = modes[BytesToInt(data[byte + 2], data[byte + 3])]
    devices[d].motor = BytesToInt(data[byte + 4], data[byte + 5])
    devices[d].operation = BytesToInt(data[byte + 6], data[byte + 7])
    devices[d].position = BytesToInt(data[byte + 8], data[byte + 9])
    devices[d].size = BytesToInt(data[byte + 10], data[byte + 11])
    devices[d].stall = BytesToInt(data[byte + 12], data[byte + 13])
    devices[d].step = BytesToInt(data[byte + 14], data[byte + 15])
    byte += 16
    if (++iterations === devices.length) {
      // console.log(iterations, devices.length, devices)
      callback(null, iterations)
    }
  }
}

// exports.updateDevices = updateDevices

var updateMeasures = function (byte, data, measures, callback) {
  var iterations = 0
  for (var m = 0; m < measures.length; m++) {
    measures[m].destination = BytesToInt(data[byte + 0], data[byte + 1])
    measures[m].position = BytesToInt(data[byte + 2], data[byte + 3])
    byte += 4
    if (++iterations === measures.length) {
      // console.log(iterations, measures.length)
      callback(null, iterations)
    }
  }
}

// exports.updateMeasures = updateMeasures

var updateMotors = function (byte, data, motors, callback) {
  var iterations = 0
  for (var m = 0; m < motors.length; m++) {
    motors[m].current = BytesToInt(data[byte + 0], data[byte + 1])
    motors[m].speed = BytesToInt(data[byte + 2], data[byte + 3])
    motors[m].status = BytesToInt(data[byte + 4], data[byte + 5])
    byte += 6
    if (++iterations === motors.length) {
      // console.log(iterations, motors.length)
      callback(null, iterations)
    }
  }
}

// exports.updateMotors = updateMotors

var updateQueue = function (byte, data, queue, callback) {
  var iterations = 0
  for (var q = 0; q < queue.length; q++) {
    queue[q].card = BytesToInt(data[byte + 0], data[byte + 1])
    queue[q].stall = BytesToInt(data[byte + 2], data[byte + 3])
    byte += 4
    if (++iterations === queue.length) {
      // console.log(iterations, devices.length)
      callback(null, iterations)
    }
  }
}

// var updateQueue = function (byte, data, queue, callback) {
//   var iterations = 0
//   queue = []
//   while (byte < s7def.DB_DATA_INIT_MB) {
//     var c = BytesToInt(data[byte + 0], data[byte + 1])
//     var s = BytesToInt(data[byte + 2], data[byte + 3])
//     console.log(byte, c, s)
//     if (c !== 0) {
//       queue.push({card: c, stall: s})
//     }
//     byte += 4
//     if (++iterations === 5) {
//       console.log(iterations, queue, queue.length)
//       callback(null, iterations)
//     }
//   }
// }

// exports.updateQueue = updateQueue
