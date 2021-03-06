'use strict';
const cheerio = require('cheerio');
const _ = require('lodash');
const he = require('he');
const path = require('path');
const bulk = require('bulk-require');
const lib_h = bulk(path.normalize(__dirname + '/..'), ['helpers/**/*.js', '**/*.js']);
const helpers = lib_h.helpers;
exports.parse = elem => {
    const supported = ['p'];
    let out = {};
    let transformedElems;
    if (_.isString(elem)) {
        elem = elem.replace(/\n|\t/gi, ''); // remove new lines;
        elem = cheerio.parseHTML(elem, true)[0]; // first child, keep scripts = true
    }
    // console.log(elem);
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    if (supported.indexOf(elem.name) > -1) {
        
        out.type = 'text';
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
// exports.parse = elem => {
//     // console.log(elem);
//     if (_.isString(elem)) {
//         // console.log(elem);
//         elem = elem.replace(/\n|\t/gi, ''); // remove new lines;
//         elem = cheerio.parseHTML(elem)[0]; // returns as an array with 1 element

//     }
//     // console.log(elem);
//     let $ = cheerio.load(elem);
//     let $elem = $(elem);
//     let children = $(elem).children();
//     let content, out; // 

//     if (children.length) {
//         // console.log(children);
//         if (children.get(0).tagName === 'iframe') { // <p><iframe src=""/></p>
//             // return raw_html
//             console.log('iframe found, returing raw_html');

//             out = {
//                 type: 'raw_html',
//                 content: $.html()
//             };
//             if (elem.attribs) {
//                 out.additional_properties = elem.attribs;
//             }
//             return out;
//         } else if (children.get(0).tagName === 'script') { 
//             // return nothing
//             console.log('this p tag contains only script tag, returning empty');
//             return null;
//         } else {
//             // console.log($elem);
//             content = _.trim($elem.html());

//             if (!_.isNil(content)) {
//                 out = {
//                     type: 'text',
//                     content: he.decode(content)
//                 };
//                 if (elem.attribs) {
//                     out.additional_properties = elem.attribs;
//                 }

//                 return out;
//             }

//         }
//     } else {
//         // Catch if there is text node;
//         // let content1 = _.trim($elem.contents());
//         // console.log('content1: '+content1);
//         content = _.trim($elem.text());
//         if (!_.isEmpty(content)) {

//             out = {
//                 type: 'text',
//                 content: content
//             };
//             if (elem.attribs) {
//                 out.additional_properties = elem.attribs;
//             }

//             return out;
//         } else{
//             return null;
//         }
//     }

//     return null;
// };
