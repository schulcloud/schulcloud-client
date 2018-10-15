import ImageCompressor from 'image-compressor.js';

import { UPLOAD_FILES } from "../actions/socket-send";
import { uploadProgress } from "../actions/socket-upload";

export const uploadImagesMiddleware = store => next => action => {
    next(action);
    if(action.type === UPLOAD_FILES && store.getState().socket.uploader) {
        let uploader = store.getState().socket.uploader;
        let url = store.getState().socket.url;

        let upload = (file) => {
            file.meta = {
                desk: action.payload.desk,
                deskType: action.payload.deskType,
                url
            };
            uploader.submitFiles([file]);
            var urlCreator = window.URL || window.webkitURL;
            var preview = urlCreator.createObjectURL(file);
            store.dispatch(uploadProgress({file, progress:0, preview, convert:true}));
        };

        (action.payload.files || []).forEach((file) => {
            if(file.type && file.type.indexOf("image/") >= 0) {
                store.dispatch(uploadProgress({file, progress:0, convert:true}));
                new ImageCompressor(file, {
                    quality: .6,
                    maxWidth: 1920,
                    success: upload,
                });
            } else {
                upload(file);
            }
          }
      );    
    }    
};