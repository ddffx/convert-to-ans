'use strict';
const cheerio = require('cheerio');
exports.parse = elem => {
    const supported = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    // console.log(supported.indexOf(elem.name));
    if (supported.indexOf(elem.name) > -1) {
        return {
            type: 'header',
            level: elem.name.substring(1),
            additional_properties: elem.attribs,
            content: $elem.text()
        };
    } else {
        return {
            error: 'NOT_SUPPORTED',
            tag: elem.name,
            raw_html: $.html()
        };
    }
};