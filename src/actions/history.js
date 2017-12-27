import * as types from '../constants/ActionTypes'
import ipc from '../api/ipc'

function requestHistory (system) {
  return {
    type: types.HISTORY_REQUEST,
    system
  }
}

function receiveHistory (system, json) {
  return {
    type: types.HISTORY_RECEIVE,
    system,
    logs: json,
    receivedAt: Date.now()
  }
}

export function fetchHistory (channel, args) {
  return dispatch => {
    ipc.send('history', args)
    dispatch(requestHistory(channel))
    ipc.on('history', (event, arg) => {
      console.log(event, arg)
      dispatch(receiveHistory(channel, arg))
    })
  }
}

export function historyModal (json) {
  return {
    type: types.HISTORY_MODAL,
    json
  }
}
