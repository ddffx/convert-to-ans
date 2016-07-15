'use strict';
const request = require('request');
const _ = require('lodash');
const async = require('async');
const util = require('util');
const _downloadMediaInfo = (featured_media, done) => {
    let url = featured_media.href;
    // console.log(url);
    request.get(url, function(err, httpresponse, body) {
        let img, jsonBody;
        if (err) {
            done(err, null);
        } else {
            if (body) {
                // filter and keep only the following
                jsonBody = JSON.parse(body);
                // for size using medium_large format
                img = {
                    created_date: jsonBody.date,
                    last_updated_date: jsonBody.modified,
                    url: _.get(jsonBody, 'media_details.sizes.medium_large.source_url'),
                    height: _.get(jsonBody, 'media_details.sizes.medium_large.height'),
                    width: _.get(jsonBody, 'media_details.sizes.medium_large.width'),
                    title: _.get(jsonBody, 'title.rendered'),
                    copyright: _.get(jsonBody, 'media_details.image_meta.copyright'),
                    credit: _.get(jsonBody, 'media_details.image_meta.credit'),
                    type: jsonBody.media_type
                };
                _.assign(img, _.pick(jsonBody, ['caption','mime_type']));
                img.version = '';
                done(null, img);
            } else {
                done(null, httpresponse.statusCode);
            }
        }
    });
};
exports.inflate = (payload, cb) => {
    // console.log(payload);
    let media_req = [];
    if (payload && payload._links && payload._links['wp:featuredmedia']) {
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
};
