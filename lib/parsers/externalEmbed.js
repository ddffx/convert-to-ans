'use strict';
/*
external embed

 */
const _ = require('lodash');
const cheerio = require('cheerio');
exports.parse = elem => {

    let txt, objectUrlStr;
    console.log('parsing external embed');
    if (_.isString(elem)) {
        // console.log(elem);
        elem = elem.replace(/\n|\t/gi, ''); // remove new lines;
        elem = cheerio.parseHTML(elem)[0]; // returns as an array with 1 element

    }
    let $ = cheerio.load(elem);
    // let $elem = $(elem);
    // get the text content
    txt = $(elem).text();
    // console.log(txt);
    if (txt) {
        // capture url
        objectUrlStr = txt.match(/^(\[external_embed\s)(.+)(\s*\])$/i)[2] || null;
        // console.log(objectUrlStr);
        if (objectUrlStr) {
            objectUrlStr = objectUrlStr.substring(5); // url= 
            objectUrlStr = objectUrlStr.substring(0, objectUrlStr.length - 2); // end quote
            // console.log(objectUrlStr);
            console.log('external embed parsing success!');
            return {
                type: 'external-embed',
                objectUrl: objectUrlStr,
                raw_content: txt
            };
        }


    } else {
        console.log('external embed parsing complete, no content');
        return null;
    }


};
