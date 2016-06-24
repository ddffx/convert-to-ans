'use strict';
const cheerio = require('cheerio');

exports.parse = elem => {
    if (elem.name === 'blockquote') {
        let $ = cheerio.load(elem);
        let $elem = $(elem);
        return {
            type: 'blockquote',
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
