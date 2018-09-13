import { combineReducers } from 'redux';
import socket from './socket-reducer';
import otherReducer from './other-reducer';

const rootReducer = combineReducers({
  socket,
  otherReducer,
});

export default rootReducer;