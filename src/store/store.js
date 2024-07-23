import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';

/* Import Reducers */
import { provider, tournaments } from './reducers'

const reducer = combineReducers({
  provider,
  tournaments
})

const initialState = {}

const middleware = [thunk]

const store = configureStore({
  reducer: reducer, 
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
  devTools: process.env.NODE_ENV !== 'production',
  initialState})

export default store
