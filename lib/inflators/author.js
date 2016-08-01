'use strict';
const request = require('request');
const _ = require('lodash');
const async = require('async');
const _downloadAuthorInfo = (author, done) => {
    let url = author.href;
    let opts = {
        uri: url,
        json:true
    };
    request.get(opts, function(err, httpresponse, body) {
        if (err) {
            done(err, null);
        } else {
            if (body) {
                done(null, body);
            } else {
                done(null, httpresponse.statusCode);
            }
        }
    });
};
exports.inflate = (payload, cb) => {
    let author_req = [];
    if (payload && payload._links && payload._links.author) {
        _.each(payload._links.author, function(author) {
            author_req.push(async.apply(_downloadAuthorInfo, author));
        });
        async.parallel(author_req, function(err, results) { // array of results
            if (err) {
                // do not return the error, log and absorb it
                console.log(err);
                // cb(err, null);
                if(payload.author){
                    cb(null, {authors: payload.author});
                }
            } else {
                // console.log(results);
                cb(null, { authors: results });
            }
        });
    }
};
