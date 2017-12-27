import * as types from '../constants/ActionTypes'
import ipc from '../api/ipc'

function requestMap (channel) {
  return {
    type: types.MAP_REQUEST,
    channel,
    // args
  }
}

function receiveMap (json) {
  return {
    type: types.MAP_RECEIVE,
    data: JSON.parse(json),
    receivedAt: Date.now()
  }
}

export function fetchMap (channel, args) {
  return dispatch => {
    ipc.send(channel, args)
    dispatch(requestMap(channel))
    ipc.on('map', (event, arg) => {
      dispatch(receiveMap(arg))
    })
  }
}

export function setEditModal (json) {
  if (json.write) ipc.send('map-edit', json)
  return {
    type: types.SET_EDIT_MODAL,
    json
  }
}

export function setVisibilityFilter (filter) {
  return {
    type: types.SET_VISIBILITY_FILTER,
    filter
  }
}
