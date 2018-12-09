export const CLIPBOARD_UPDATE = 'CLIPBOARD_UPDATE';
export const CLIPBOARD_INIT = 'CLIPBOARD_INIT';

export function setClipboardState(state) {
    return {
        type: CLIPBOARD_INIT,
        payload: state,
    };
}

export function updateClipboardState(update) {
    return {
        type: CLIPBOARD_UPDATE,
        payload: update,
    };
}