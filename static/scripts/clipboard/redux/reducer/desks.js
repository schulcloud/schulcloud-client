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
        case CLIPBOARD_INIT:{
            const desk = state.desk || action.payload.me.id;
            const deskType = state.deskType || action.payload.me.bucket;
            return {
                ...action.payload.desks,
                desk,
                deskType,
                currentDesk: deskType && desk && action.payload.desks[deskType][desk]
            };
        }
        case CLIPBOARD_UPDATE:
            {
                return action.payload.desks ? {
                    ...state,
                    ...action.payload.desks,
                    currentDesk: state.deskType && state.desk && action.payload.desks[state.deskType][state.desk]
                } : state;
            }
        case SET_DESK:
            {
                const desk = action.payload;
                return {
                    ...state,
                    desk,
                    currentDesk: state.deskType && desk && state[state.deskType][desk]
                };
            }
        case SET_DESK_TYPE:
            {
                const desks = state[action.payload] || {};
                const desk = Object.keys(desks).length === 1 ?
                        Object.keys(desks)[0] :
                        (state.deskType !== action.payload ? null : state.deskType);
                const deskType = action.payload;
                return {
                    ...state,
                    deskType,
                    desk,
                    currentDesk: deskType && desk && state[deskType][desk]
                };
            }
        default:
            return state;
    }
}