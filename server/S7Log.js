/**
* Module dependencies.
*/
var s7utils = require('./s7utils')

/**
 * S7Log constructor
 * @public
 */

var S7Log = function (data) {
  this.stx = s7utils.BytesToInt(data[0], data[1])
  this.system = s7utils.BytesToInt(data[2], data[3])
  this.device = s7utils.BytesToInt(data[4], data[5])
  this.mode = s7utils.BytesToInt(data[6], data[7])
  this.operation = s7utils.BytesToInt(data[8], data[9])
  this.stall = s7utils.BytesToInt(data[10], data[11])
  this.card = s7utils.BytesToInt(data[12], data[13])
  this.size = s7utils.BytesToInt(data[14], data[15])
  this.alarm = s7utils.BytesToInt(data[16], data[17])
  this.event = s7utils.BytesToInt(data[18], data[19])
  this.date = s7utils.getPLCDateTime(s7utils.BytesToInt(data[20], data[21]), s7utils.BytesToLong(data[22], data[23], data[24], data[25]))
  // this.time = s7utils.getPlcTime(s7utils.BytesToLong(data[22], data[23], data[24], data[25]))
  this.elapsed = s7utils.BytesToLong(data[26], data[27], data[28], data[29])
  this.etx = s7utils.BytesToInt(data[30], data[31])
}

module.exports = S7Log
