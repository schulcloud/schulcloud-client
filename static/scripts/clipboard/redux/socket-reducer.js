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
const CLIPBOARD_INIT = 'CLIPBOARD_INIT';

const initialState = {
  connected: false,
  readyState: null,
  socket: null,
  uploader: null,
  clipboard:{
    board:{},
    media:[],
    users:[]
  },
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
      let upload = {...uploads[action.payload.name], ...action.payload};
      uploads[upload.name] = upload;
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
      };

    case SOCKET_SEND:
      return {
        ...state,
        sending: true
      };
    case CLIPBOARD_INIT:
      return {
        ...state,
        sending: false,
        clipboard: action.payload
      };
    case CLIPBOARD_UPDATE:{
      let uploads = Object.keys(state.upload||{}).reduce((acc, key) => {
        if(state.upload[key].progress < 100) {
          acc[key] = state.upload[key];
        }
        return acc;
      }, {});
      
      return {
        ...state,
        sending: false,
        uploads,
        clipboard: {
          ...state.clipboard,
          ...action.payload
        }
      };
    }
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
      dispatch(setClipboardState(state));
    });

    socket.on("clipboardStateUpdate", function (update) {
      dispatch(updateClipboardState(update));
    });

    function initUploader() {
      let uploader = new SocketIOFileUpload(socket);
      uploader.addEventListener("start", (event) => 
        dispatch(uploadProgress({file:event.file, progress:0})));
      uploader.addEventListener("progress", (event) => 
        dispatch(uploadProgress({file:event.file, progress:event.bytesLoaded / event.file.size * 100})));
      uploader.addEventListener("complete", (event) => 
        dispatch(uploadProgress({file:event.file, progress:100})));
      uploader.addEventListener("error", (event) => 
        dispatch(uploadProgress({file:event.file, progress:100, error: event.message})));
      
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

function setClipboardState(state) {
  return {
    type: CLIPBOARD_INIT,
    payload: state,
  };
}

function updateClipboardState(update) {
  return {
    type: CLIPBOARD_UPDATE,
    payload: update,
  };
}

function socketUploaderInit(uploader) {
  return {
    type: SOCKET_UPLOADER_INIT,
    uploader,
  };
}

export function uploadProgress(update) {
  let payload = {
    file: update.file.name,
    name: update.file.name,
    sender: update.convert ? "Konvertieren" : "Hochladen",
    progress: update.progress,
    type: {
      mime: update.file.type
    },
  };
  if(update.preview) payload.src = update.preview;
  return {
    type: UPLOAD_PROGRESS,
    payload
  };
}