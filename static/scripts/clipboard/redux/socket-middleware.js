import { SOCKET_SEND } from "./socket-actions";

export const socketEmit = store => next => action => {
    next(action);
    if(action.type === SOCKET_SEND && store.getState().socket.connected) {
        store.getState().socket.socket.emit(action.message, action.payload);
    }
};