import { SOCKET_SEND } from "../actions/socket-send";

export const socketSendMiddleware = store => next => action => {
    next(action);
    if (action.includeDesk) {
        if(!(action.payload instanceof Object)) {
            action.payload = {payload: action.payload};
        }
        action.payload.desk = store.getState().desks.desk;
        action.payload.deskType = store.getState().desks.deskType;
    }
    if (action.type === SOCKET_SEND && store.getState().socket.connected) {
        store.getState().socket.socket.emit(action.message, action.payload);
    }
};