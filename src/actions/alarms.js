import * as types from '../constants/ActionTypes'
import ipc from '../api/ipc'

function requestAlarms (channel) {
  return {
    type: types.ALARMS_REQUEST,
    // system
  }
}

function receiveAlarms (json) {
  return {
    type: types.ALARMS_RECEIVE,
    cards: JSON.parse(json),
    receivedAt: Date.now()
  }
}

export function fetchAlarms (channel, args) {
  return dispatch => {
    ipc.send(channel, args)
    dispatch(requestAlarms(channel))
    ipc.on('alarms', (event, arg) => {
      dispatch(receiveAlarms(arg))
    })
  }
}
