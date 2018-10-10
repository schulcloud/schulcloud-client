import io from 'socket.io-client';
import SocketIOFileUpload from 'socketio-file-upload';
import {
  socketConnectionInit,
  socketConnectionSuccess,
  socketConnectionClosed,
  socketConnectionError,
  socketUploaderInit,
} from './actions/socket-status';

import {
  uploadProgress
} from './actions/socket-upload';

import {
  setClipboardState,
  updateClipboardState
} from './actions/socket-receive';

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

