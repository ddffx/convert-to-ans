'use strict';
const request = require('request');
const _ = require('lodash');
const async = require('async');
const util = require('util');
const path = require('path');
const bulk = require('bulk-require');
const lib_h = bulk(path.normalize(__dirname+'/..'), ['helpers/**/*.js', '**/*.js']);
const helpers = lib_h.helpers;

const _downloadMediaInfo = (featured_media, done) => {
    let url = featured_media.href;
    // console.log(url);
    request.get(url, function(err, httpresponse, body) {
        let img, jsonBody;
        if (err) {
            done(err, null);
        } else {
            if (body && httpresponse.headers['content-type'].match(/^(application\/json)/)) {
                // filter and keep only the following
                jsonBody = JSON.parse(body);
                img = helpers.processMediaObjects(jsonBody);
                done(null, img);
            } else {
                done(null, url); // not a valid media url return it back
            }
        }
    });
};

exports.inflate = (payload, cb) => {
    // console.log(payload);
    let media_req = [], out;
    if (_.isObject(payload.featured_media) && !_.isEmpty(payload.featured_media)) { // already included in the payload
        console.log('Processing featured media obj attached with the post');
        // return it as an array
        out = {
            featured_media: [helpers.processMediaObjects(payload.featured_media)] // return as array
        };
        return cb(null, out);
    } else {
        if (payload && payload._links && payload._links['wp:featuredmedia']) {
             console.log('Processing featured media from payload._links[\'wp:featuredmedia\']');
            _.each(payload._links['wp:featuredmedia'], function(fm) {

                media_req.push(async.apply(_downloadMediaInfo, fm));
            });
            async.parallel(media_req, function(err, results) { // array of results
                if (err) {
                    cb(err, null);
                } else {
                    cb(null, { featured_media: results });
                }
            });
        } else {
            cb(null, 'input does not contain featured media info');
        }
    }
};
