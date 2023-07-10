import client from './client';

/**
 * Helper for parsing form data
 * @param e
 */

export const parse = e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};

    for (let entry of formData.entries()) {
        data[entry[0]] = entry[1]
    }

    return data;
};

/**
 * Capitalize first letter of a string
 * @param str
 * @returns {string}
 */

export const capitalize = str => {
    if (typeof str !== 'string') {
        return '';
    }

    return str.charAt(0).toUpperCase() + str.slice(1)
};

/**
 * Returns acronym of words
 * @param str
 * @returns {string}
 */

export const acronym = (str = '') => {
    return (str.match(/\b\w/g) || []).join('').toUpperCase();
};

/**
 * Returns given parsed query string
 * @param string
 * @returns {string}
 */

export const parseQs = (string = '') => {
    let query = string.substring(1);
    let vars = query.split('&');
    let parsed = {};

    for (let i = 0, len = vars.length; i < len; i++) {
        let pair = vars[i].split('=');
        parsed[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }

    return parsed;
};

/**
 * Json helper
 * @param data
 * @returns {*}
 */

export const json = data => {
    if (Array.isArray(data) || typeof data === 'object') {
        return JSON.stringify(data);
    }

    return JSON.parse(data);
};

/**
 * Helper for confirming actions
 * @param message
 * @param ok
 * @param failed
 */

export const confirm = (message, ok, failed) => {
    client.events.emit('confirm', {
        ok,
        failed,
        message
    });
};

/**
 * Deep clones an object
 * @type {{}}
 */

export const clone = (obj = {}) => {
    let copy;

    if (null == obj || "object" != typeof obj) {
        return obj;
    }

    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    if (obj instanceof Array) {
        copy = [];

        for (let i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }

        return copy;
    }

    if (obj instanceof Object) {
        copy = {};

        for (let attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }

        return copy;
    }
};

/**
 * Cleans an object
 * @param obj
 */

export const clean = (obj = {}) => {
    obj = clone(obj);
    delete obj.__key;
    delete obj.__original;
    delete obj._id;
    return obj;
};

/**
 * Colorize object helper
 * @type {{print: (function(*=): string), replacer: (function(*, *=, *=, *=, *=): *)}}
 */

export const colorize = json => {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
};
