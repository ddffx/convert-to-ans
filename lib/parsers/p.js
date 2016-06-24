'use strict';
const cheerio = require('cheerio');

exports.parse = elem => {
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    if (elem.name === 'p') {
        return {
            type: 'text',
            additional_properties: elem.attribs,
            content: $elem.text()
        };
    } else {
        return {
            error: 'NOT_SUPPORTED',
            tag: elem.name
        };
    }

};