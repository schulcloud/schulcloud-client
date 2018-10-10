import { SOCKET_SEND } from "../actions/socket-send";

export const socketSendMiddleware = store => next => action => {
    next(action);
    if (action.type === SOCKET_SEND && store.getState().socket.connected) {
        store.getState().socket.socket.emit(action.message, action.payload);
    }
};