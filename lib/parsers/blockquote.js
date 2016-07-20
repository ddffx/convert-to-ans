'use strict';
const cheerio = require('cheerio');
const _ = require('lodash');
exports.parse = elem => {

	if(_.isString(elem)){
		elem = elem.replace(/\n|\t/gi, ''); // remove new lines;
		elem = cheerio.parseHTML(elem)[0]; // first child
	}
    if (elem.name === 'blockquote') {
        // console.log(elem);
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
