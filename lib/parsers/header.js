'use strict';
const cheerio = require('cheerio');
const _ = require('lodash');
exports.parse = elem => {
    const supported = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

     if(_.isString(elem)){
        elem = elem.replace(/\n|\t/gi, ''); // remove new lines tab characters;
        elem = cheerio.parseHTML(elem)[0]; // first child
    }
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