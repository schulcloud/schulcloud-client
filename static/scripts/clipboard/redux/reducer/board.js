import {
    CLIPBOARD_INIT,
    CLIPBOARD_UPDATE
} from '../actions/socket-receive';

const initialState = {
    media: []
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CLIPBOARD_INIT:
            return action.payload.board;

        case CLIPBOARD_UPDATE:
            {
                return action.payload.board ?
                    {
                        ...state,
                        ...action.payload.board
                    } :
                    state;
            }
        default:
            return state;
    }
}