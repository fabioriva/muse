import {
  UI_SIDEBAR_MENU_ACTIVE,
  UI_SIDEBAR_TOGGLE,
  UI_NAVBAR_TITLE,
  UI_NAVBAR_COMM,
  UI_NAVBAR_DIAG,
  UI_NAVBAR_LOG
} from '../constants/ActionTypes'

const initialState = {
  navbar: {
    title: '',
    comm: {
      isOnline: false
    },
    diag: {
      alarmCount: 0,
      isActive: false
    },
    log: {
      // message: '',
      // receivedAt: ''
    }
  },
  sidebar: {
    activeItem: '1',
    collapsed: true
  }
}

const ui = (state = initialState, action) => {
  switch (action.type) {
    case UI_SIDEBAR_MENU_ACTIVE:
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          activeItem: action.item
        }
      }
    case UI_SIDEBAR_TOGGLE:
      return {
        ...state,
        sidebar: {
          ...state.sidebar,
          collapsed: action.status
        }
      }
    case UI_NAVBAR_TITLE:
      return {
        ...state,
        navbar: {
          ...state.navbar,
          title: action.title
        }
      }
    case UI_NAVBAR_COMM:
      return {
        ...state,
        navbar: {
          ...state.navbar,
          comm: action.info
        }
      }
    case UI_NAVBAR_DIAG:
      return {
        ...state,
        navbar: {
          ...state.navbar,
          diag: action.info
        }
      }
    case UI_NAVBAR_LOG:
      return {
        ...state,
        navbar: {
          ...state.navbar,
          log: {
            message: action.log,
            receivedAt: action.receivedAt
          }
        }
      }
      // return Object.assign({}, state, { log: {
      //   isFetching: false,
      //   message: action.log,
      //   lastUpdated: action.receivedAt
      // }})
    default:
      return state
  }
}

export default ui
