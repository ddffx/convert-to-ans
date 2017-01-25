'use strict';
const _ = require('lodash');
const cheerio = require('cheerio');
const async = require('async');
const util = require('util');
const debuglog = util.debuglog('ans');
const bulk = require('bulk-require');

const lib_i = bulk(__dirname + '/lib', ['inflators/**/*.js', '**/*.js']);
const inflators = lib_i.inflators;
const lib_h = bulk(__dirname + '/lib', ['helpers/**/*.js', '**/*.js']);
const helpers = lib_h.helpers;
// console.log(helpers);
const _parseHtml = (content, post_uid) => {
    content = content.replace(/\n/gi, ''); // remove new lines;
    // replace blank p tags

    // console.log(content);
    let elems = cheerio.parseHTML(content, true); // keep the script tags
    // console.log(elems);
    let mapped = _.map(elems, function(elem) {
        let out, parser;
        // select a parser, involves all kinds of logic, returns a parse function form parser library
        parser = helpers.selectParser(elem);
        // console.log(parser);
        out = parser.parse(elem);
        if (out) {
            // assign a local unique id
            out._id = _.isEmpty(post_uid) ? _.uniqueId() : post_uid + '_' + _.uniqueId();
            return out;
        } else {
            // console.log('no parsed content for:' + elem);
            return null;
        }

    });
    // remove null or undefined objects for blank / filtered content
    mapped = _.filter(mapped, function(obj) {
        return !_.isEmpty(obj);
    });
    // console.log(mapped);
    return mapped;
};
// // depreciation candidate
// const _parseTitle = (titleObj) => {
//     return parsers['title'].parse(titleObj);
// };

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
    // console.log(props);

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
        // _.assign(result, _parseTitle(payload)); // will be depricated
        _.assign(result, helpers.selectParser('headlines').parse(payload));
    }
    // dates
    if (payload.date) {
        result['created_date'] = payload.date;
    }
    if (payload.modified) {
        result['last_updated_date'] = payload.modified;
    }
    if (payload.meta && helpers.selectParser('meta')) {
        _.assign(result, helpers.selectParser('meta').parse(payload));
    }
    // include blog_section in transformed content, used for commercial node and potentially other purposes
    if (payload.blog_section) {
        let section_obj = helpers.parseSection(payload.blog_section);
        if (section_obj) {
            result['blog_section'] = section_obj.section;
            if (section_obj.sub_section) {
                result['blog_subsection'] = section_obj.sub_section;
            }
        }

        result['commercial_node'] = payload.blog_section;
    }
    // add tracking object
    if (helpers.selectParser('tracking')) {
        // includes the already available tracking object, if not then constructs one
        _.assign(result, helpers.selectParser('tracking').parse(payload));
    }

    // add parent slug reading from attributes collection, depraceated, this moves inside *attributes* object
    if(payload.attributes && !_.isEmpty(payload.attributes.parent_slug)){
        result['parent_slug'] = payload.attributes.parent_slug;
    }
    // pass all attributes
    if(payload.attributes){
       result['backend_attrs'] = payload.attributes;
    }
    // parse payload body
    result['content_elements'] = _parseHtml(payload.content.rendered, payload.cms_uid || '');

    // update ombeds in the content elements are copying them form meta section
    if (payload.meta) {

        result['content_elements'] = helpers.replaceOembeds(result['content_elements'], payload.meta);
    }

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
        async.apply(inflators['featured_media'].inflate, payload),
        // inflate header media
        async.apply(inflators['header_media'].inflate, payload)
    ], (err, results) => {
        let output, authors, featured_media, header_media;
        if (err) {
            cb(err, null);
        } else {
            // console.log(results);
            output = _.find(results, 'headlines');
            authors = _.find(results, 'authors');
            featured_media = _.find(results, 'featured_media');
            header_media = _.find(results, 'header_media');
            if (authors) {
                console.log('attaching authors in transform');
                output['credits'] = [authors];
            } else {
                console.log('authors not found, not included in transform');
            }

            if (featured_media) {
                console.log('attaching featured media in transform');
                _.assign(output, featured_media);
            } else {
                console.log('featured media not found, not included in transform');
            }
            if (header_media) {
                console.log('attaching header media in transform');
                _.assign(output, header_media);
            } else {
                console.log('header media not found, not included in transform');
            }
            debuglog(output);
            return cb(null, output);
        }
    });


};
