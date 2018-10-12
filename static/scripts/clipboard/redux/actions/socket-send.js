export const SOCKET_SEND = 'SOCKET_SEND';
export const UPLOAD_FILES = 'UPLOAD_FILES';

export function setMediaOnBoard({
    slot,
    media
}) {
    return {
        type: SOCKET_SEND,
        message: "SET_MEDIA_ON_BOARD",
        payload: {
            slot,
            media
        }
    };
}

export function addMedia(media) {
    return {
        type: SOCKET_SEND,
        message: "ADD_MEDIA",
        payload: media
    };
}

export function deleteMedia(id) {
    return {
        type: SOCKET_SEND,
        message: "DELETE_MEDIA",
        payload: id
    };
}

export function uploadFiles(files) {
    return {
        type: UPLOAD_FILES,
        message: "UPLOAD_FILES",
        payload: files
    };
}

export function setBoardLayout(layout) {
    return {
        type: SOCKET_SEND,
        message: "SET_BOARD_LAYOUT",
        payload: layout
    };
}