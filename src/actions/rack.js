import * as types from '../constants/ActionTypes'
import ipc from '../api/ipc'

function requestRack (channel) {
  return {
    type: types.RACK_REQUEST,
    channel,
    // args
  }
}

function receiveRack (json) {
  return {
    type: types.RACK_RECEIVE,
    data: JSON.parse(json),
    receivedAt: Date.now()
  }
}

export function fetchRack (channel, args) {
  return dispatch => {
    ipc.send(channel, args)
    dispatch(requestRack(channel))
    ipc.on('racks', (event, arg) => {
      dispatch(receiveRack(arg))
    })
  }
}
