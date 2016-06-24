'use strict';
const cheerio = require('cheerio');
exports.parse = elem => {
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
            if (list.children.length && list.children.length === 1) {
                out.content = list.children[0].data;
                out.type = 'text';
            }
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
