'use strict';
const _ = require('lodash');
const cheerio = require('cheerio');

exports.parseList = elem => {

};

exports.parseHeader = elem => {
    const supported = ['h1', 'h2", "h3', 'h4', 'h5', 'h6'];
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    if (_.find(elem.name)) {
        return {
            type: 'header',
            level: elem.name.substring(1),
            additional_properties: elem.attribs,
            content: $elem.text()
        };
    } else {
        return {
            error: 'NOT_SUPPORTED'
        };
    }
};
exports.parsePTag = elem => {

};
exports.toRawHtml = elems => {

};
