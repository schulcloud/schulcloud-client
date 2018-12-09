import {
    SOCKET_CONNECTION_INIT,
    SOCKET_CONNECTION_SUCCESS,
    SOCKET_CONNECTION_ERROR,
    SOCKET_CONNECTION_CLOSED,
    SOCKET_SEND,
    SOCKET_UPLOADER_INIT
} from '../actions/socket-status';

const initialState = {
    connected: false,
    socket: null,
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case SOCKET_CONNECTION_INIT:
            return {
                ...state,
                connected: false,
                socket: action.socket,
                url: action.url,
                sending: false,
            };

        case SOCKET_CONNECTION_SUCCESS:
            return {
                ...state,
                connected: true,
            };

        case SOCKET_CONNECTION_ERROR:
            return {
                ...state,
                error: action.payload,
                connected: false,
            };

        case SOCKET_CONNECTION_CLOSED:
            return {
                ...state,
                connected: false,
            };

        case SOCKET_SEND:
            return {
                ...state,
                sending: true
            };

        case SOCKET_UPLOADER_INIT:
            return {
                ...state,
                uploader: action.uploader,
            };

        default:
            return state;
    }
}