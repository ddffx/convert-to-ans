'use strict';
const _ = require('lodash');
const path = require('path');
const bulk = require('bulk-require');
const lib_p = bulk(path.normalize(__dirname+'/..'), ['parsers/**/*.js', '**/*.js']);
const cheerio = require('cheerio');
const parsers = lib_p.parsers;

module.exports = function(elem) {
    // console.log(elem.name);
    let parser, txt_cnt;
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
                if($elem.children().length ){ // video embeds, youtube vimeo
                    
                    if ($elem.children().get(0).tagName === 'iframe'){
                        parser = parsers['oembed'];
                    }
                    
                } else{
                    // console.log('output text node');
                    // console.log('output text node: '+$(elem).contents());
                    // find out if there are other types of content like external embed
                    txt_cnt =  $(elem).text();
                    if(txt_cnt){
                        
                        if(txt_cnt.match(/^(\[external_embed\s)(.+)(\s*\])$/i)){
                            // console.log(txt_cnt);
                            parser = parsers['externalEmbed'];
                        }
                    }
                }

            }

        } else {

            if (elem.name.match(/^h\d$/)) {
                parser = parsers['header'];
            } else if (elem.name.match(/^(o|u)l$/)) {
                parser = parsers['list'];
            } else if(elem.name.match(/div/) && elem.attribs.class && (elem.attribs.class.indexOf('posttv-video-embed') > -1 )) {
                parser = parsers['oembed'];
            } else {
                parser = parsers['rawhtml'];
            }
        }
        return parser;
    }
    return null;

};
