import {
  HISTORY_REQUEST,
  HISTORY_RECEIVE,
  HISTORY_MODAL
} from '../constants/ActionTypes'

const initialState = {
  isFetching: true,
  history: {
    query: {},
    rows: []
  },
  modal: {
    visible: false,
    range: {
      value: []
    },
    filter: {
      value: 'a'
    }
  }
}

function history (state = initialState, action) {
  switch (action.type) {
    case HISTORY_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case HISTORY_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        history: action.logs,
        lastUpdated: action.receivedAt
      })
    case HISTORY_MODAL:
      return Object.assign({}, state, {
        modal: {...state.modal, ...action.json}
      })
    default:
      return state
  }
}

export default history
