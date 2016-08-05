'use strict';
const request = require('request');
const _ = require('lodash');
const async = require('async');
const path = require('path');
const bulk = require('bulk-require');
const lib_h = bulk(path.normalize(__dirname + '/..'), ['helpers/**/*.js', '**/*.js']);
const helpers = lib_h.helpers;
const _downloadAuthorInfo = (authorLink, done) => {
    let url = authorLink.href,
        author;
    let opts = {
        uri: url,
        json: true
    };
    request.get(opts, function(err, httpresponse, body) {
        if (err) {
            done(err, null);
        } else {
            if (body) {
                author = helpers.processAuthorObjects(body);
                done(null, author);
            } else {
                done(null, httpresponse.statusCode);
            }
        }
    });
};
exports.inflate = (payload, cb) => {
    let author_req = [],
        out;
    if (_.isObject(payload.author) && !_.isEmpty(payload.author)) { // already included in the payload
        console.log('Processing author obj attached with the post');
        // return it as an array
        let result = [];
        _.forEach(payload.author, function(item) {
            let res = helpers.processAuthorObjects(item);
            // console.log(res);
            if (!_.isEmpty(res)) {
                result.push(res);
            }
        });
        out = {
            authors: result // return as array
        };
        return cb(null, out);
    } else {
        if (payload && payload._links && payload._links.author) {
            _.each(payload._links.author, function(author) {
                author_req.push(async.apply(_downloadAuthorInfo, author));
            });
            async.parallel(author_req, function(err, results) { // array of results
                if (err) {
                    // do not return the error, log and absorb it
                    console.log(err);
                    // cb(err, null);
                    if (payload.author) {
                        cb(null, { authors: payload.author });
                    }
                } else {
                    // console.log(results);
                    cb(null, { authors: results });
                }
            });
        }
    }
};
