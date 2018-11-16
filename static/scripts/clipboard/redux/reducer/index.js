import { combineReducers } from 'redux';
import socket from './socket';
import uploads from './uploads';

import desks from './desks';
import users from './users';
import me from './me';

const rootReducer = combineReducers({
  socket,
  uploads,
  desks,
  users,
  me
});

export default rootReducer;