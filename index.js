'use strict';
const _ = require('lodash');
const cheerio = require('cheerio');
const elemParser = require('./elem-parser');
const _parseHtml = content => {
	content = content.replace(/\n/gi, ''); // remove new lines;
	console.log(content);
	let elems = cheerio.parseHTML(content);
	// console.log(elems);
	let mapped = _.map(elems, function(elem){
		let out;
		
		if(elem.name.match(/^h\d$/)){
			out = elemParser.parseHeader(elem);
		}
		if(elem.name.match(/^(o|u)l$/)){
			out = elemParser.parseList(elem);
		}
		if(out){
			out._id = _.uniqueId();
		}
		
		
		return out;
	});
	// console.log(mapped);
	return mapped;
};

exports.parse = (payload, opts, cb) => {
    // make sure input parama present
    let result = {},
        input, ansType, props, req_props, errFields = [], $;
    if (_.isEmpty(payload) || _.isEmpty(opts)) {
        return cb(new Error('payload and type required'), null);
    }
    // initialize object properties based on schema
    props = _.keys(opts.schema.definition.properties);
    req_props = opts.schema.required;
    // console.log(props);

    _(props).forEach(prop => {
        if (!_.isUndefined(payload[prop]) || !_.isEmpty(payload[prop])) {
            result[prop] = payload[prop];
        }
    });
    // update version if available
    if(opts.schema.version){
    	result.version = opts.schema.version;
    }
    // update type if available
    if(opts.schema.type){
    	result.type = opts.schema.version;
    }

    // parse payload body
    result['content_elements'] = _parseHtml(payload.content.rendered);


    // make sure required pros are there.
    _(req_props).forEach(prop => {
        if(_.isEmpty(result[prop])) {
            errFields.push(prop);
        }
    });
    
    if(errFields.length > 0){
    	let msg = errFields.join(',') + ' missing';
    	return cb (new Error(msg), null);
    }
    console.log(result);
    return cb(null, result);
};
