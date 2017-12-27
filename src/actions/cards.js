import * as types from '../constants/ActionTypes'
import ipc from '../api/ipc'

// const {
//   ON_CANCEL,
//   ON_CHANGE,
//   ON_OK
// } = types.ModalEvents

function requestCards (channel) {
  return {
    type: types.CARDS_REQUEST,
    // system
  }
}

function receiveCards (json) {
  return {
    type: types.CARDS_RECEIVE,
    cards: JSON.parse(json),
    receivedAt: Date.now()
  }
}

export function fetchCards (channel, args) {
  return dispatch => {
    ipc.send(channel, args)
    dispatch(requestCards(channel))
    ipc.on('cards', (event, arg) => {
      dispatch(receiveCards(arg))
    })
  }
}

export function cardEdit (json) {
  return dispatch => {
    ipc.send('card-edit', json)
    dispatch(requestCards('cards'))
    ipc.on('cards', (event, arg) => {
      dispatch(receiveCards(arg))
    })
  }
}

export function cardModal (json) {
  return {
    type: types.CARDS_MODAL,
    json
  }
}

// export function cardModal (event, json) {
//   console.log(event, json)
//   switch (event) {
//     case ON_CANCEL:
//     case ON_CHANGE:
//       cardModalSet(json)
//       break
//     case ON_OK:
//       return dispatch => {
//         ipc.send('card-edit', json)
//         dispatch(cardModalSet(json))
//       }
//   }
// }
