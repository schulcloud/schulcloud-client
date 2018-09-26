
import ImageCompressor from 'image-compressor.js';

function subscribeClipboardChanges(cb) {
    window.clipboardSocket.on('clipboardUpdate', image => cb(null, image));
}

function subscribeClipboardRefresh(cb) {
  window.clipboardSocket.on('clipboardState', images => cb(null, images));
}

function subscribeClipboardPush(cb) {
  window.clipboardSocket.on('pushToClipboard', media => cb(null, media));
}

function uploadFiles(files, uploader) {
    files.forEach((file) => {
        if(file.type && file.type.indexOf("image/") >= 0) {
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

function refreshClipboard(images) {
  window.clipboardSocket.emit("refreshClipboard");
}

function pushToClipboard(media) {
  window.clipboardSocket.emit("pushToClipboard", media);
}

function onReconnect(cb) {
  window.clipboardSocket.on('reconnect', () => cb());
}

export { 
  subscribeClipboardChanges,
  subscribeClipboardRefresh,
  subscribeClipboardPush,
  uploadFiles,
  refreshClipboard,
  pushToClipboard,
  onReconnect
};