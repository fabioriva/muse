import * as types from '../constants/ActionTypes'
import ipc from '../api/ipc'

function requestOverview (channel) {
  return {
    type: types.OVERVIEW_REQUEST
    // system
  }
}

function receiveOverview (json) {
  return {
    type: types.OVERVIEW_RECEIVE,
    data: JSON.parse(json),
    receivedAt: Date.now()
  }
}

export function fetchOverview (channel, args) {
  return dispatch => {
    ipc.send(channel, args)
    dispatch(requestOverview(channel))
    ipc.on('overview', (event, arg) => {
      dispatch(receiveOverview(arg))
    })
  }
}

export function setOverviewModal (json) {
  // if (json.write) ipc.send('map-edit', json)
  return {
    type: types.SET_OVERVIEW_MODAL,
    json
  }
}
