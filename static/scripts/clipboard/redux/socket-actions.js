export const SOCKET_SEND = 'SOCKET_SEND';

export function addToBoard(media) {
    return {
        type: SOCKET_SEND,
        message: "ADD_TO_BOARD",
        payload: media
      };
}
export function updateMediaOnBoard(media) {
    return {
        type: SOCKET_SEND,
        message: "UPDATE_MEDIA_ON_BOARD",
        payload: media
      };
}

export function removeMediaFromBoard(media) {
    return {
        type: SOCKET_SEND,
        message: "REMOVE_MEDIA_FROM_BOARD",
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