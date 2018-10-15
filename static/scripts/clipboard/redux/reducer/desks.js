import {
    CLIPBOARD_INIT,
    CLIPBOARD_UPDATE
} from '../actions/socket-receive';

import {
    SET_DESK,
    SET_DESK_TYPE
} from '../actions/local';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case CLIPBOARD_INIT:
            return {
                ...action.payload.desks,
                desk: state.desk || action.payload.me.id,
                deskType: state.deskType || action.payload.me.bucket
            };

        case CLIPBOARD_UPDATE:
            {
                return action.payload.desks ? {
                    ...state,
                    ...action.payload.desks
                } : state;
            }
        case SET_DESK:
            {
                return {
                    ...state,
                    desk: action.payload
                };
            }
        case SET_DESK_TYPE:
            {
                let desks = state[action.payload] || {};
                return {
                    ...state,
                    deskType: action.payload,
                    desk: Object.keys(desks).length === 1 ?
                            Object.keys(desks)[0] :
                            (state.deskType !== action.payload ? null : state.deskType)
                };
            }
        default:
            return state;
    }
}