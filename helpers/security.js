const stripJs = require('strip-js');

/**
 * Strips JS Code from an object/array/string and returns clean version of it
 * @param data {object/array/string}
 * @returns {object/array/string} - clean without JS
 */
const stripAllJs = (data) => {
    if (typeof data === "object") {
        for (var key in data) {
            let hasKey = data.hasOwnProperty(key);
            if(hasKey && typeof data[key] === "string") {
                data[key] = stripJs(data[key]);
            } else if (hasKey && Array.isArray(data[key])) {
                stripAllJs(data[key]);
            } else if (hasKey && typeof data[key] === "object") {
                stripAllJs(data[key]);
            }
        }
    } else if (typeof data === "string") {
        data = stripJs(data);
    } else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            if (typeof data === "string") {
                data[i] = stripJs(data[i]);
            } else if (Array.isArray(data[i])) {
                stripAllJs(data[i]);
            } else if (typeof data[i] === "object") {
                stripAllJs(data[i]);
            }
        }
    }
    return data;
};


module.exports = {
    stripAllJs
};
