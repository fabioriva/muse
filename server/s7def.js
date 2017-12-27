const FALSE = Buffer.alloc(1, 0, 'hex')
const TRUE = Buffer.alloc(1, 1, 'hex')

const CARDS = 208
const STALLS = 208

const StallStatus = {
  FREE: 0,
  PAPA: 997,  // 65533
  RSVD: 998,  // 65534
  LOCK: 999   // 65535
}

const CARD_LEN = 10
const CARD_INDEX_INIT = 410
const CARD_VALUE_INIT = 412

const STALL_LEN = 10
const MAP_INDEX_INIT = 406
const MAP_VALUE_INIT = 408

const DB_CARDS = 441
const DB_CARDS_INIT = 0
const DB_CARDS_LEN = CARDS * CARD_LEN

const DB_MAP = 440
const DB_MAP_INIT = 0
const DB_MAP_LEN = STALLS * STALL_LEN

const DB_DATA = 450
const DB_DATA_INIT = 0
const DB_DATA_INIT_DEVICE = 32
const DB_DATA_INIT_POS = 96
const DB_DATA_INIT_MOT = 266
const DB_DATA_INIT_QUEUE = 160
const DB_DATA_INIT_AB = 236
const DB_DATA_INIT_EB = 188
const DB_DATA_INIT_MB = 180
const DB_DATA_LEN = 398
// const DB_QUEUE = 40

const REQ_ENTRY_1 = 342
const REQ_ENTRY_2 = 344
const REQ_EXIT = 346

const ALARM_LEN = 8
const DB_ALARM_1 = 431
const DB_ALARM_2 = 432
const DB_ALARM_3 = 433
const DB_ALARM_4 = 434
const DB_ALARM_INIT = 12
const DB_ALARM_LEN = 16 * ALARM_LEN * 4

module.exports = {
  FALSE,
  TRUE,
  StallStatus,
  CARD_LEN,
  CARD_INDEX_INIT,
  CARD_VALUE_INIT,
  STALL_LEN,
  MAP_INDEX_INIT,
  MAP_VALUE_INIT,
  DB_CARDS,
  DB_CARDS_INIT,
  DB_CARDS_LEN,
  DB_DATA,
  DB_DATA_INIT,
  DB_DATA_INIT_DEVICE,
  DB_DATA_INIT_POS,
  DB_DATA_INIT_MOT,
  DB_DATA_INIT_QUEUE,
  DB_DATA_INIT_AB,
  DB_DATA_INIT_EB,
  DB_DATA_INIT_MB,
  DB_DATA_LEN,
  DB_MAP,
  DB_MAP_INIT,
  DB_MAP_LEN,
  // DB_QUEUE,
  REQ_ENTRY_1,
  REQ_ENTRY_2,
  REQ_EXIT,
  DB_ALARM_1,
  DB_ALARM_2,
  DB_ALARM_3,
  DB_ALARM_4,
  DB_ALARM_INIT,
  DB_ALARM_LEN
}
