import io from 'socket.io-client';
import SocketIOFileUpload from 'socketio-file-upload';
import {SOCKET_SEND} from './socket-actions';

const SOCKET_CONNECTION_INIT = 'SOCKET_CONNECTION_INIT';
const SOCKET_UPLOADER_INIT = 'SOCKET_UPLOADER_INIT';
export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';
const SOCKET_CONNECTION_SUCCESS = 'SOCKET_CONNECTION_SUCCESS';
const SOCKET_CONNECTION_ERROR = 'SOCKET_CONNECTION_ERROR';
const SOCKET_CONNECTION_CLOSED = 'SOCKET_CONNECTION_CLOSED';
const CLIPBOARD_UPDATE = 'CLIPBOARD_UPDATE';

const initialState = {
  connected: false,
  readyState: null,
  socket: null,
  uploader: null,
  clipboard:{},
  uploads:{}
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

    case SOCKET_UPLOADER_INIT:
      return {
        ...state,
        uploader: action.uploader,
      };

    case UPLOAD_PROGRESS: {
      let uploads = {...state.uploads};
      uploads[action.name] = {
        file: action.file.name,
        sender: action.convert ? "Konvertieren" : "Hochladen",
        progress: action.progress,
        type: {
          mime: action.file.type
        },
        src: action.file.preview,
      };
      if(action.progress === 100) {
        delete uploads[action.name];
      }
      return {
        ...state,
        uploads
      };
    }

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
      initUploader();
    });

    socket.on("reconnect", function() {
      dispatch(socketConnectionSuccess());
      initUploader();
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

    function initUploader() {
      let uploader = new SocketIOFileUpload(socket);
      uploader.addEventListener("start", (event) => 
        dispatch(uploadProgress(event.file, 0)));
      uploader.addEventListener("progress", (event) => 
        dispatch(uploadProgress(event.file, event.bytesLoaded / event.file.size * 100)));
      uploader.addEventListener("complete", (event) => 
        dispatch(uploadProgress(event.file, 100)));
      uploader.addEventListener("error", (event) => 
        dispatch(uploadProgress(event.file, 100, event.message)));
      
      dispatch(socketUploaderInit(uploader));
    }

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

function socketUploaderInit(uploader) {
  return {
    type: SOCKET_UPLOADER_INIT,
    uploader,
  };
}

export function uploadProgress(file, progress, error, convert) {
  return {
    type: UPLOAD_PROGRESS,
    file,
    name: file.name,
    progress,
    error,
    convert
  };
}