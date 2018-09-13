import SocketIOFileUpload from 'socketio-file-upload';

function subscribeClipboardChanges(cb) {
    window.clipboardSocket.on('clipboardUpdate', image => cb(null, image));
}

function subscribeClipboardRefresh(cb) {
  window.clipboardSocket.on('clipboardState', images => cb(null, images));
}

function subscribeClipboardPush(cb) {
  window.clipboardSocket.on('pushToClipboard', media => cb(null, media));
}

function broadcastNewImage(images, socket) {
  var uploader = new SocketIOFileUpload(socket);
  uploader.submitFiles(images);
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
  broadcastNewImage,
  refreshClipboard,
  pushToClipboard,
  onReconnect
};