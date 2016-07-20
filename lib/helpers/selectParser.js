'use strict';
const _ = require('lodash');
const path = require('path');
const bulk = require('bulk-require');
const lib_p = bulk(path.normalize(__dirname+'/..'), ['parsers/**/*.js', '**/*.js']);
const cheerio = require('cheerio');
const parsers = lib_p.parsers;

module.exports = function(elem) {
    // console.log(elem.name);
    let parser;
    // looking for a static parser by name? Then return it
    if (_.isString(elem)) {
        return parsers[elem] || null;
    }

    if (elem.name) {
        if (parsers[elem.name]) {
            // return appropriate parser function
            parser = parsers[elem.name];
            if (elem.name === 'blockquote' && elem.attribs.class && (elem.attribs.class.indexOf('twitter-tweet') > -1 || elem.attribs.class.indexOf('instagram-media') > -1)) {
            	parser = parsers['oembed'];
            }
            // iframe inside p or div
            if(elem.name === 'p' || elem.name === 'div'){
                let $ = cheerio.load(elem);
                let $elem = $(elem);
                if($elem.children().length && $elem.children().get(0).tagName === 'iframe'){ // video embeds, youtuv vimeo
                    parser = parsers['oembed'];
                }
            }

        } else {

            if (elem.name.match(/^h\d$/)) {
                parser = parsers['header'];
            } else if (elem.name.match(/^(o|u)l$/)) {
                parser = parsers['list'];
            } else {
                parser = parsers['rawhtml'];
            }
        }
        return parser;
    }
    return null;

};
