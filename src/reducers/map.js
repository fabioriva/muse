import {
  MAP_RECEIVE,
  MAP_REQUEST,
  SET_EDIT_MODAL,
  SET_VISIBILITY_FILTER,
  VisibilityFilters
} from '../constants/ActionTypes'

const initialState = {
  isFetching: true,
  map: {
    levels: [],
    limits: {},
    statistics: []
  },
  visibilityFilter: VisibilityFilters.SHOW_NUMBERS,
  editModal: {
    stall: 0,
    value: 0,
    visible: false,
    write: false
  }
}

function map (state = initialState, action) {
  switch (action.type) {
    case MAP_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case MAP_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        map: action.data,
        lastUpdated: action.receivedAt
      })
    case SET_EDIT_MODAL:
      return Object.assign({}, state, {
        editModal: {
          stall: action.json.stall,
          value: action.json.value,
          visible: action.json.visible,
          write: action.json.write
        }
      })
    case SET_VISIBILITY_FILTER:
      return Object.assign({}, state, {
        visibilityFilter: action.filter
      })
    default:
      return state
  }
}

export default map
