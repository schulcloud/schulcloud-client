import {
    CLIPBOARD_INIT,
    CLIPBOARD_UPDATE
} from '../actions/socket-receive';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CLIPBOARD_INIT:
            return action.payload.users;

        case CLIPBOARD_UPDATE:
            {
                return action.payload.users ?
                    {
                        ...state,
                        ...action.payload.users
                    } :
                    state;
            }
        default:
            return state;
    }
}