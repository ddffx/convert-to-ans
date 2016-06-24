'use strict';
const cheerio = require('cheerio');

exports.parse = elem => {
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    return {
        type: 'raw_html',
        content: $.html()
    };
};