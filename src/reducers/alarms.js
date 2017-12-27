import {
  ALARMS_RECEIVE,
  ALARMS_REQUEST
} from '../constants/ActionTypes'

const alarms = {
  count: 0,
  groups: [
    {
      count: 0,
      active: []
    },
    {
      count: 0,
      active: []
    },
    {
      count: 0,
      active: []
    },
    {
      count: 0,
      active: []
    }
  ]
}

const initialState = {
  isFetching: true,
  alarms: alarms
}

function cards (state = initialState, action) {
  switch (action.type) {
    case ALARMS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case ALARMS_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        alarms: action.cards
      })
    default:
      return state
  }
}

export default cards
