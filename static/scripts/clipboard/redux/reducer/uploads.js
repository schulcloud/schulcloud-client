import { UPLOAD_PROGRESS } from '../actions/socket-upload';
import { CLIPBOARD_UPDATE } from '../actions/socket-receive';

const initialState = {};

export default function reducer(state = initialState, action = {}) {
    switch (action.type) {
        case UPLOAD_PROGRESS:
            {
                return {
                    ...state,
                    [action.payload.name]: {
                        ...state[action.payload.name],
                        ...action.payload
                    }
                };
            }

        case CLIPBOARD_UPDATE:
            {
                if (!action.payload.desks) return state;
                if (Object.keys(state).length === 0) return state;
                //Delete all finished uploads
                let filteredState = Object.keys(state).reduce((acc, key) => {
                    if (state.upload[key].progress < 100) {
                        acc[key] = state.upload[key];
                    }
                    return acc;
                }, {});
                return filteredState;
            }
        default:
            return state;
    }
}