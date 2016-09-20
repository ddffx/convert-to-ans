'use strict';
const cheerio = require('cheerio');
const _ = require('lodash');
const _renderText = $el => {
    // console.log($el.html());
    return $el.html() || 'TEXT NA';
};
const _renderTagHtml = $el => {
    let $ = cheerio.load($el);
    return $.html($el) || 'HTML NA';
};
const tagToHtml = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const inlineElems = _.concat('abbr, acronym, cite, code, dfn, em, kbd, strong, samp, time, var'.split(', '),
    'b, big, i, small, tt'.split(', '),
    'a, bdo, br, img, map, object, q, script, span, sub, sup'.split(', '),
    'button, input, label, select, textarea'.split(', ')
);
const _renderElm = elm => {
    let $ = cheerio.load(elm);
    let $elm = $(elm);

    let out = {};
    if (elm.attribs && !_.isEmpty(elm.attribs)) {
        out.additional_properties = elm.attribs;
    }
    // if(elm.name === 'li' && elm.children[0].name === 'small'){
    //     console.log(inlineElems.indexOf(elm.children[0].name));
    //     console.log(elm.children);
    // }

    if (elm.children && elm.children[0].data && !_.isEmpty(_.trim(elm.children[0].data))) { // remove only blanl spaces
        // We got a  beginning of a text node or an inline element print everyting inside as text .
        out.content = _renderText($elm);
        out.type = 'text';
    } else if (elm.children && inlineElems.indexOf(elm.children[0].name) > -1) { // starts with inline elements
        // console.log(inlineElems.indexOf(elm.children[0].name));
        out.content = _renderText($elm);
        out.type = 'text';
    } else {
        // with children
        let items = [];
        let child_elms = $elm.children();

        child_elms.each(function(index, el) {
            let $el = $(this);
            // console.log(el);
            if (el && el.type === 'text') {
                // console.log(el);
                out.content = _renderText($el);
                out.type = 'text';
            } else {
                if (el && el.type === 'tag' && tagToHtml.indexOf(el.name) > -1) {
                    out.content = _renderTagHtml($el);
                    out.type = 'text';
                } else {
                    // console.log(el.type + '|' + el.name);
                    let item = _renderElm(el);
                    items.push(item);
                }
            }
        });
        if (items.length) {
            out.items = items;
        }
    }

    return out;
};
module.exports = _renderElm;
