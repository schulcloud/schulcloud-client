import {
    CLIPBOARD_INIT,
    CLIPBOARD_UPDATE
} from '../actions/socket-receive';

const initialState = {
    id: undefined,
    name: ""
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CLIPBOARD_INIT:
            return action.payload.me;

        case CLIPBOARD_UPDATE:
            {
                return action.payload.me ?
                    {
                        ...state,
                        ...action.payload.me
                    } :
                    state;
            }
        default:
            return state;
    }
}