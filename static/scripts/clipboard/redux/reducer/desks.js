import {
    CLIPBOARD_INIT,
    CLIPBOARD_UPDATE
} from '../actions/socket-receive';

import {
    SET_DESK,
    SET_DESK_TYPE
} from '../actions/local';

const initialState = {
    deskType: '',
    desk: ''
};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CLIPBOARD_INIT:
            return {
                ...action.payload.desks,
                desk: action.payload.me.id,
                deskType: action.payload.me.bucket
            };

        case CLIPBOARD_UPDATE:
            {
                return action.payload.desks ?
                    {
                        ...state,
                        ...action.payload.desks
                    } :
                    state;
            }
        case SET_DESK: {
            return {
                ...state,
                desk: action.payload
            };
        }
        case SET_DESK_TYPE: {
            return {
                ...state,
                deskType: action.payload
            };
        }
        default:
            return state;
    }
}