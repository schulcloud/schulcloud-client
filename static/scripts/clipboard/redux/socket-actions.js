export const SOCKET_SEND = 'SOCKET_SEND';

export function selectMedia(media) {
    return {
        type: SOCKET_SEND,
        message: "SELECT_MEDIA",
        payload: media
      };
}

export function addMedia(media) {
    return {
        type: SOCKET_SEND,
        message: "ADD_MEDIA",
        payload: media
      };
}