export const UPLOAD_PROGRESS = 'UPLOAD_PROGRESS';

export function uploadProgress(update) {
    let payload = {
        file: update.file.name,
        name: update.file.name,
        sender: update.convert ? "Konvertieren" : "Hochladen",
        progress: Math.floor(update.progress),
        type: {
            mime: update.file.type
        },
    };
    if (update.preview) payload.src = update.preview;
    return {
        type: UPLOAD_PROGRESS,
        payload
    };
}