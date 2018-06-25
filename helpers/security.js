const stripJs = require('strip-js');

/**
 * Strips JS Code from an object/array/string and returns clean version of it
 * @param data {object/array/string}
 * @returns {object/array/string} - clean without JS
 */
const stripAllJs = (data) => {
    // iterate over every object/array element and strip it
    if (typeof data === "object") {
        for (var key in data) {
            if(data.hasOwnProperty(key)) {
                data[key] = stripJs(data[key]);
            }
        }
    } else if (typeof data === "Array") {
        for (let i = 0; i < data.length; i++) {
            data[i] = stripJs(data[i]);
        }
    }
    return data;
};


module.exports = {
    stripAllJs
};
