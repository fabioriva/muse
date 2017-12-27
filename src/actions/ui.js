import * as types from '../constants/ActionTypes'
import ipc from '../api/ipc'

export function setMenuActive (item) {
  return {
    type: types.UI_SIDEBAR_MENU_ACTIVE,
    item
  }
}

export function toggleSidebar (status) {
  return {
    type: types.UI_SIDEBAR_TOGGLE,
    status
  }
}

export function setNavbarTitle (title) {
  return {
    type: types.UI_NAVBAR_TITLE,
    title
  }
}

function receiveComm (json) {
  return {
    type: types.UI_NAVBAR_COMM,
    info: JSON.parse(json),
    receivedAt: Date.now()
  }
}

function receiveDiag (json) {
  return {
    type: types.UI_NAVBAR_DIAG,
    info: JSON.parse(json),
    receivedAt: Date.now()
  }
}

function receiveLog (log) {
  return {
    type: types.UI_NAVBAR_LOG,
    log: log,
    receivedAt: Date.now()
  }
}

export function fetchNavbarData () {
  return dispatch => {
    ipc.on('comm', (event, arg) => {
      dispatch(receiveComm(arg))
    })
    ipc.on('diag', (event, arg) => {
      dispatch(receiveDiag(arg))
    })
    ipc.on('log', (event, arg) => {
      dispatch(receiveLog(arg))
    })
  }
}
