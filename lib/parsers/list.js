'use strict';
const cheerio = require('cheerio');
const _ = require('lodash');
const path = require('path');
const bulk = require('bulk-require');
const lib_h = bulk(path.normalize(__dirname + '/..'), ['helpers/**/*.js', '**/*.js']);
const helpers = lib_h.helpers;

exports.parse = elem => {
    const supported = ['ol', 'ul'];
    let out = {};
    let transformedElems;
    if (_.isString(elem)) {
        elem = elem.replace(/\n|\t/gi, ''); // remove new lines;
        elem = cheerio.parseHTML(elem)[0]; // first child
    }
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    if (supported.indexOf(elem.name) > -1) {
        out.list_type = elem.name === 'ol' ? 'ordered_list' : 'unordered_list';
        if (elem.attribs) {
            out.additional_properties = elem.attribs;
        }
        transformedElems = helpers.transformElem(elem);
        if (!_.isEmpty(transformedElems)) {
            _.assign(out, transformedElems);
        }
        return out;
    } else {
        return {
            error: 'NOT_SUPPORTED',
            tag: elem.name,
            raw_html: $elem.html()
        };
    }
};
