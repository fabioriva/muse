import {
  CARDS_RECEIVE,
  CARDS_REQUEST,
  CARDS_MODAL
} from '../constants/ActionTypes'
// import moment from 'moment'

const initialState = {
  isFetching: true,
  cards: [],
  modal: {
    visible: false,
    card: {
      value: 0
    },
    code: {
      value: ''
    },
    timeFrom: {
      value: '00:00:00'
    },
    timeTo: {
      value: '23:59:59'
    }
  }
}

function cards (state = initialState, action) {
  switch (action.type) {
    case CARDS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      })
    case CARDS_RECEIVE:
      return Object.assign({}, state, {
        isFetching: false,
        cards: action.cards,
        lastUpdated: action.receivedAt
      })
    case CARDS_MODAL:
      return Object.assign({}, state, {
        modal: {...state.modal, ...action.json}
      })
    default:
      return state
  }
}

export default cards
