const stripJs = require('strip-js');

/**
 * Strips JS Code from an object/array/string and returns clean version of it
 * @param data {object/array/string}
 * @returns {object/array/string} - clean without JS
 */
const stripAllJs = (data) => {
    if (typeof data === "object") {
        for (var key in data) {
            if(data.hasOwnProperty(key) && typeof data[key] === "string") {
                data[key] = stripJs(data[key]);
            } else if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
                for (let i = 0; i < data[key].length; i++) {
                    data[key][i] = stripJs(data[key][i]);
                }
            } else if (data.hasOwnProperty(key) && typeof data[key] === "object") {
                stripAllJs(data[key]);
            }
        }
    } else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = stripJs(data[i]);
        }
    }
    return data;
};


module.exports = {
    stripAllJs
};
