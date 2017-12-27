import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from '../reducers'

export default function configureStore (preloadedState) {
  const store = createStore(
    rootReducer,
    applyMiddleware(
      thunkMiddleware,  // lets us dispatch() functions
      createLogger()    // neat middleware that logs actions
    )
  )
  return store
}
