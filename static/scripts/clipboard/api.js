export function subscribeClipboardChanges(cb) {
    window.clipboardSocket.on('clipboardUpdate', image => cb(null, image));
}

export function subscribeClipboardRefresh(cb) {
  window.clipboardSocket.on('clipboardState', images => cb(null, images));
}

export function subscribeClipboardPush(cb) {
  window.clipboardSocket.on('pushToClipboard', media => cb(null, media));
}

export function refreshClipboard(images) {
  window.clipboardSocket.emit("refreshClipboard");
}

export function pushToClipboard(media) {
  window.clipboardSocket.emit("pushToClipboard", media);
}

export function onReconnect(cb) {
  window.clipboardSocket.on('reconnect', () => cb());
}