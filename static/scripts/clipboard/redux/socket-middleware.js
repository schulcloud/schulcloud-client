import { SOCKET_SEND, UPLOAD_FILES } from "./socket-actions";
import { UPLOAD_PROGRESS, uploadProgress} from "./socket-reducer";
import ImageCompressor from 'image-compressor.js';

export const socketEmit = store => next => action => {
    next(action);
    if(action.type === SOCKET_SEND && store.getState().socket.connected) {
        store.getState().socket.socket.emit(action.message, action.payload);
    }

    if(action.type === UPLOAD_FILES && store.getState().socket.uploader) {
        let uploader = store.getState().socket.uploader;
        (action.payload || []).forEach((file) => {
            if(file.type && file.type.indexOf("image/") >= 0) {
                store.dispatch(uploadProgress(file, 0, undefined, true));
                new ImageCompressor(file, {
                    quality: .8,
                    maxWidth: 1920,
                    success: (file) => uploader.submitFiles([file]),
                });
            } else {
              uploader.submitFiles([file]);
            }
          }
      );    
    }    
};