import io from 'socket.io-client';
import {SOCKET_SEND} from './socket-actions';

const SOCKET_CONNECTION_INIT = 'SOCKET_CONNECTION_INIT';
const SOCKET_CONNECTION_SUCCESS = 'SOCKET_CONNECTION_SUCCESS';
const SOCKET_CONNECTION_ERROR = 'SOCKET_CONNECTION_ERROR';
const SOCKET_CONNECTION_CLOSED = 'SOCKET_CONNECTION_CLOSED';
const CLIPBOARD_UPDATE = 'CLIPBOARD_UPDATE';

const initialState = {
  connected: false,
  readyState: null,
  socket: null,
  clipboard:{},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case SOCKET_CONNECTION_INIT:
      return {
        ...state,
        connected: false,
        socket: action.socket,
        url: action.url,
        sending: false,
      };

    case SOCKET_CONNECTION_SUCCESS:
      return {
        ...state,
        connected: true,
      };

    case SOCKET_CONNECTION_ERROR:
      return {
        ...state,
        error: action.payload,
        connected: false,
      };

    case SOCKET_CONNECTION_CLOSED:
      return {
        ...state,
        connected: false,
        socket: null,
      };

    case SOCKET_SEND:
      return {
        ...state,
        sending: true
      };

    case CLIPBOARD_UPDATE:
      return {
        ...state,
        sending: false,
        clipboard: action.payload
      };
    default:
      return state;
  }
}

export function initializeSocket(url, namespace, settings = {}) {
  return (dispatch) => {
    const socket = io(url + '/' + namespace, settings);
    dispatch(socketConnectionInit(socket, url));

    socket.on("connect", function() {
      dispatch(socketConnectionSuccess());  
    });

    socket.on("reconnect", function() {
      dispatch(socketConnectionSuccess());  
    });

    socket.on("reconnecting", function() {
      dispatch(socketConnectionClosed());
    });
    
    socket.on("disconnect", function() {
      dispatch(socketConnectionClosed());
    });
    
    socket.on("error", function(error) {
      dispatch(socketConnectionError(error));  
    });

    socket.on("reconnect_error", function(error) {
      dispatch(socketConnectionError(error));  
    });

    socket.on("clipboardState", function (state) {
      dispatch(updateClipboardState(state));
    });


  };
}

function socketConnectionInit(socket, url) {
  return {
    type: SOCKET_CONNECTION_INIT,
    url,
    socket,
  };
}

function socketConnectionSuccess() {
  return {
    type: SOCKET_CONNECTION_SUCCESS,
  };
}

function socketConnectionError(error) {
  return {
    type: SOCKET_CONNECTION_ERROR,
    payload: error
  };
}

function socketConnectionClosed() {
  return {
    type: SOCKET_CONNECTION_CLOSED,
  };
}

function updateClipboardState(state) {
  return {
    type: CLIPBOARD_UPDATE,
    payload: state,
  };
}