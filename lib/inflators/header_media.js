'use strict';
const request = require('request');
const _ = require('lodash');
const async = require('async');
const util = require('util');
const validator = require('validator');
const path = require('path');
const bulk = require('bulk-require');
const lib_h = bulk(path.normalize(__dirname + '/..'), ['helpers/**/*.js', '**/*.js']);
const helpers = lib_h.helpers;
const _downloadMediaInfo = (url, done) => {
    // console.log(url);
    let opts = {
        uri: url,
        json:true
    };
    request.get(opts, function(err, httpresponse, body) {
        let img, jsonBody;
        if (err) {
            done(err, null);
        } else {
            if (body) {
                img = helpers.processMediaObjects(body);
                done(null, img);
            } else {
                done(null, url); // not a valid wordpress media url, return it back
            }
        }
    });
};
exports.inflate = (payload, cb) => {
    // console.log(payload);
    let media_req = [],
        header_imgs, out = [];
    let header_image = _.get(payload, 'meta.header_image'); // array
    // check header image is a url string, array of urls or array of objects
    if (_.isArray(header_image) && !_.isEmpty(header_image) && header_image[0].media_type === 'image') { // already included in the payload
        console.log('Processing header media obj attached with the post');
        _.each(header_image, function(imgObj) {
            out.push(helpers.processMediaObjects(imgObj));
        });
        // console.log(out);
        cb(null, { header_media: out });

    } else {
        if (header_image) {
            if (_.isString(header_image)) {
                header_imgs = [header_image];
            } else {
                header_imgs = header_image;
            }
            console.log('Processing remote header media url');
            _.each(header_imgs, function(url) {
                if (validator.isURL(url)) {
                    media_req.push(async.apply(_downloadMediaInfo, url));
                }

            });
            async.parallel(media_req, function(err, results) { // array of results
                // if (results) {
                //     console.log(JSON.stringify(results));
                // }

                if (err) {
                    cb(err, null);
                } else {
                    cb(null, { header_media: results });
                }
            });
        } else {
            cb(null, null);
        }
    }
};
