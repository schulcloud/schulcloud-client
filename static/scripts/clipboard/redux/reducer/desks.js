import {
    CLIPBOARD_INIT,
    CLIPBOARD_UPDATE
} from '../actions/socket-receive';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CLIPBOARD_INIT:
            return action.payload.desks;

        case CLIPBOARD_UPDATE:
            {
                return action.payload.desks ?
                    {
                        ...state,
                        ...action.payload.desks
                    } :
                    state;
            }
        default:
            return state;
    }
}