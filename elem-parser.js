'use strict';
const _ = require('lodash');
const cheerio = require('cheerio');

const _toRawHtml = elem => {
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    return {
        type: 'raw_html',
        content: $.html()
    };
};

exports.parseList = elem => {
    const supported = ['ol', 'ul'];
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    if (supported.indexOf(elem.name) > -1) {
        // get children
        let list_elems = [];
        $elem.children().each(function(index, list) {
            // console.log(list);
            let out = {
                additional_properties: list.attribs,
            };
            if(list.children.length && list.children.length === 1){
                out.content = list.children[0].data;
                out.type =  'text';
            }
            console.log(out);
            list_elems.push(out);
        });
        return {
            list_type: elem.name === 'ol' ? 'ordered_list' : 'unordered_list',
            additional_properties: elem.attribs,
            items: list_elems
        };
    } else {
        return {
            error: 'NOT_SUPPORTED',
            tag: elem.name,
            raw_html: $elem.html()
        };
    }
};

exports.parseHeader = elem => {
    const supported = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
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
exports.parsePTag = elem => {
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    if (elem.name === 'p') {
        return {
            type: 'text',
            additional_properties: elem.attribs,
            content: $elem.text()
        };
    } else {
        return {
            error: 'NOT_SUPPORTED',
            tag: elem.name
        };
    }

};
exports.toRawHtml = _toRawHtml;

exports.parseBlockquote = elem => {
    if (elem.name === 'blockquote') {
        let $ = cheerio.load(elem);
        let $elem = $(elem);
        return {
            type: 'blockquote',
            additional_properties: elem.attribs,
            content: $elem.text()
        };
    } else {
        return {
            error: 'NOT_SUPPORTED',
            tag: elem.name
        };
    }
};
