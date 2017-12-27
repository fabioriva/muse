import {
  RACK_RECEIVE,
  RACK_REQUEST
} from '../constants/ActionTypes'

const initialState = {
  isFetching: true,
  racks: []
}

function racks (state = initialState, action) {
  switch (action.type) {
    case RACK_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RACK_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        racks: action.data,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}

export default racks
