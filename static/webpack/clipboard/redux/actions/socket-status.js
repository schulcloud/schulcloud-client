export const SOCKET_CONNECTION_INIT = 'SOCKET_CONNECTION_INIT';
export const SOCKET_UPLOADER_INIT = 'SOCKET_UPLOADER_INIT';
export const SOCKET_CONNECTION_SUCCESS = 'SOCKET_CONNECTION_SUCCESS';
export const SOCKET_CONNECTION_ERROR = 'SOCKET_CONNECTION_ERROR';
export const SOCKET_CONNECTION_CLOSED = 'SOCKET_CONNECTION_CLOSED';


export function socketConnectionInit(socket, url) {
    return {
        type: SOCKET_CONNECTION_INIT,
        url,
        socket,
    };
}

export function socketConnectionSuccess() {
    return {
        type: SOCKET_CONNECTION_SUCCESS,
    };
}

export function socketConnectionError(error) {
    return {
        type: SOCKET_CONNECTION_ERROR,
        payload: error
    };
}

export function socketConnectionClosed() {
    return {
        type: SOCKET_CONNECTION_CLOSED,
    };
}

export function socketUploaderInit(uploader) {
    return {
        type: SOCKET_UPLOADER_INIT,
        uploader,
    };
}