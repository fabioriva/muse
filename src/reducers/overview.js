import {
  OVERVIEW_RECEIVE,
  OVERVIEW_REQUEST,
  SET_OVERVIEW_MODAL
} from '../constants/ActionTypes'

const initialState = {
  isFetching: true,
  data: {
    devices: {},
    buttons: [],
    queue: []
  },
  operationModal: {}
}

function overview (state = initialState, action) {
  switch (action.type) {
    case OVERVIEW_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case OVERVIEW_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data,
        lastUpdated: action.receivedAt
      })
    case SET_OVERVIEW_MODAL:
      return Object.assign({}, state, {
        operationModal: action.json
      })
    default:
      return state
  }
}

export default overview
