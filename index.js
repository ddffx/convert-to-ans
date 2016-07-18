'use strict';
const _ = require('lodash');
const cheerio = require('cheerio');
const async = require('async');
const util = require('util');
const debuglog = util.debuglog('ans');
const bulk = require('bulk-require');
const lib_p = bulk(__dirname + '/lib', ['parsers/**/*.js', '**/*.js']);
const lib_i = bulk(__dirname + '/lib', ['inflators/**/*.js', '**/*.js']);
debuglog(lib_p);
const parsers = lib_p.parsers;
const inflators = lib_i.inflators;
const _parseHtml = content => {
    content = content.replace(/\n/gi, ''); // remove new lines;
    // replace blank p tags

    // console.log(content);
    let elems = cheerio.parseHTML(content);
    // console.log(elems);
    let mapped = _.map(elems, function(elem) {
        let out;
        // console.log('parse elem:' + elem.name);
        if (elem.name) {
            if (parsers[elem.name]) {
                out = parsers[elem.name].parse(elem);
            } else {

                if (elem.name.match(/^h\d$/)) {
                    out = parsers['header'].parse(elem);
                } else if (elem.name.match(/^(o|u)l$/)) {
                    out = parsers['list'].parse(elem);
                } else {
                    out = parsers['rawhtml'].parse(elem);
                }
            }
        }
        if (out) {
            out._id = _.uniqueId();
            return out;
        }

    });
    // console.log(mapped);
    return mapped;
};
// depreciation candidate
const _parseTitle = (titleObj) => {
    return parsers['title'].parse(titleObj);
};

const _prepareResult = (payload, opts, cb) => {
    let result = {},
        input, ansType, props, req_props, errFields = [];
    // make sure input param present
    if (_.isEmpty(payload) || _.isEmpty(opts)) {
        return cb(new Error('payload and type required'), null);
    }
    // initialize object properties based on schema
    props = _.keys(opts.schema.definition.properties);
    req_props = opts.schema.required;
    console.log(props);

    _(props).forEach(prop => {
        if (!_.isUndefined(payload[prop]) || !_.isEmpty(payload[prop])) {
            result[prop] = payload[prop];
        }
    });
    // update version if available
    if (opts.schema.version) {
        result.version = opts.schema.version;
    }
    // update type if available
    if (opts.schema.type) {
        result.type = opts.schema.version;
    }
    // parse title
    if (payload.title) {
        _.assign(result, _parseTitle(payload)); // will be depricate
        _.assign(result, parsers['headlines'].parse(payload));
    }
    // dates
    if (payload.date) {
        result['created_date'] = payload.date;
    }
    if (payload.modified) {
        result['last_updated_date'] = payload.modified;
    }
    if(payload.meta){
        _.assign(result, parsers['meta'].parse(payload));
    }
    // parse payload body
    result['content_elements'] = _parseHtml(payload.content.rendered);


    // make sure required props are there.
    _(req_props).forEach(prop => {
        if (_.isEmpty(result[prop])) {
            errFields.push(prop);
        }
    });

    if (errFields.length > 0) {
        let msg = errFields.join(',') + ' missing';
        return cb(new Error(msg), null);
    }
    // debuglog(result);
    return cb(null, result);
};

exports.parse = (payload, opts, cb) => {

    async.parallel([
        // prepare 
        async.apply(_prepareResult, payload, opts),
        // inflate authors, returns all authors of the content in an array
        async.apply(inflators['author'].inflate, payload), 
        // inflate featured media
        async.apply(inflators['featured_media'].inflate, payload) 
    ], (err, results) => {
        // console.log(results);
        let output = _.find(results,'title');
        let authors = _.find(results,'authors');
        // _.assign(output,_.find(results,'authors'));
        let featured_media = _.find(results,'featured_media');
        if(authors){
            console.log('attaching authors in transform')
            output['credits'] = [authors];
        }

        if(featured_media) {
            console.log('attaching featured media in transform')
             _.assign(output,featured_media);
        }
        
        
        if (err) {
            cb(err, null);
        } else {
            debuglog(output);
            return cb(null, output);
        }
    });


};
