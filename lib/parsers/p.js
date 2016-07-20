'use strict';
const cheerio = require('cheerio');
const _ = require('lodash');
const he = require('he');
exports.parse = elem => {
    // console.log(elem);
    if (_.isString(elem)) {
        elem = elem.replace(/\n|\t/gi, ''); // remove new lines;
        elem = cheerio.parseHTML(elem)[0]; // returns as an array with 1 element

    }
    // console.log(elem);
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    let children = $(elem).children();
    let content; // 
    // console.log(children);
    if (children.length && children.get(0).tagName === 'iframe') { // <p><iframe src=""/></p>
        // return raw_html
        console.log('iframe found, returing raw_html');
        return {
            type: 'raw_html',
            content: $.html()
        };
    } else if (children.length && children.get(0).tagName === 'script') { // <p><iframe src=""/></p>
        // return nothing
        console.log('this p tag contains only script tag, returning empty');
        return null;
    } else {
        // console.log($elem);
        content = _.trim($elem.html());
       
        if (!_.isNil(content)) {
            return {
                type: 'text',
                additional_properties: elem.attribs,
                content: he.decode(content)
            };
        }

    }
    return null;
};
