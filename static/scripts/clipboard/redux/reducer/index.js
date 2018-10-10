import { combineReducers } from 'redux';
import socket from './socket';
import uploads from './uploads';

import board from './board';
import desks from './desks';
import users from './users';

const rootReducer = combineReducers({
  socket,
  uploads,
  board,
  desks,
  users
});

export default rootReducer;