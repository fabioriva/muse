import { combineReducers } from 'redux'
import ui from './ui'
import alarms from './alarms'
import cards from './cards'
import history from './history'
import map from './map'
import overview from './overview'
import rack from './rack'

const rootReducer = combineReducers({
  ui,
  alarms,
  cards,
  history,
  map,
  overview,
  rack
})

export default rootReducer
