'use strict';
const request = require('request');
const _ = require('lodash');
const async = require('async');
const util = require('util');
const _downloadMediaInfo = (url, done) => {
    // console.log(url);
    request.get(url, function(err, httpresponse, body) {
        let img, jsonBody;
        if (err) {
            done(err, null);
        } else {
            if (body) {
                // filter and keep only the following
                jsonBody = JSON.parse(body);
                img = {
                    created_date: jsonBody.date,
                    last_updated_date: jsonBody.modified,
                    title: _.get(jsonBody, 'title.rendered', ''),
                    copyright: _.get(jsonBody, 'media_details.image_meta.copyright', ''),
                    credit: _.get(jsonBody, 'media_details.image_meta.credit', ''),
                    type: jsonBody.media_type,
                    cms_guid: url   
                };
                if(jsonBody.media_details && jsonBody.media_details.sizes){
                    img.sizes = _.pick(jsonBody.media_details.sizes, ['thumbnail', 'full','medium']);
                    // remove file fields
                    _.unset(img.sizes, 'thumbnail.file');
                    _.unset(img.sizes, 'full.file');
                    _.unset(img.sizes, 'medium.file')
                }
                _.assign(img, _.pick(jsonBody, ['caption','mime_type', ]));
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
    let media_req = [], header_imgs;
    let header_image = _.get(payload,'meta.header_image'); // array
    if (header_image) {
        if(_.isString(header_image)){
            header_imgs = [header_image];
        } else{
            header_imgs = header_image;
        }
        _.each(header_imgs, function(fm) {
            media_req.push(async.apply(_downloadMediaInfo, fm));
        });
        async.parallel(media_req, function(err, results) { // array of results
            if(results){
                console.log(JSON.stringify(results));
            }
            
            if (err) {
                cb(err, null);
            } else {
                cb(null, { header_media: results });
            }
        });
    } else {
        cb(null, null);
    }
};
