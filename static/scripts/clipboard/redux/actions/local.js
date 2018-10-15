export const SET_DESK = 'SET_DESK';
export const SET_DESK_TYPE = 'SET_DESK_TYPE';

export function setDesk(desk) {
    return {
        type: SET_DESK,
        payload: desk,
    };
}

export function setDeskType(deskType) {
    return {
        type: SET_DESK_TYPE,
        payload: deskType,
    };
}