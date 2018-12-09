export const SOCKET_SEND = 'SOCKET_SEND';
export const UPLOAD_FILES = 'UPLOAD_FILES';

export function setMediaOnBoard({
    slot,
    media
}) {
    return {
        type: SOCKET_SEND,
        message: "SET_MEDIA_ON_BOARD",
        includeDesk: true,
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
        includeDesk: true,
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
        includeDesk: true,
        payload: layout
    };
}

export function createGroupDesk(name) {
    return {
        type: SOCKET_SEND,
        message: "CREATE_GROUP_DESK",
        payload: {
            name
        }
    };
}

export function deleteGroupDesk(name) {
    return {
        type: SOCKET_SEND,
        message: "DELETE_GROUP_DESK",
        payload: {
            name
        }
    };
}

export function resetClipboard() {
    return {
        type: SOCKET_SEND,
        message: "RESET_CLIPBOARD"
    };
}