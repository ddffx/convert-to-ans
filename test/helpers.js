'use strict';
const util = require('util');
const debuglog = util.debuglog('ans');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const _ = require('lodash');
const bulk = require('bulk-require');
const lib = bulk(process.cwd() + '/lib', ['helpers/**/*.js', '**/*.js']);

const helpers = lib.helpers;
debuglog(helpers);

const Glob = require('glob-fs');
const glob_json = new Glob();
const path = require('path');

// let html_files = glob_html.readdirSync('test/fixtures/parsers/*.html');

let json_src_files = glob_json.readdirSync('test/fixtures/helpers/*-src.json');

debuglog(json_src_files);

describe(' Helper functions ', function() {

    _(json_src_files).forEach(function(item) {
        // console.log(item);
        // console.log(key);
        let cnt_file = path.basename(item, '.json'); // remove src
        let helper = cnt_file.indexOf('-') > 0 ? cnt_file.split('-')[0] : cnt_file;
        let dir = path.dirname(item);
        debuglog(helper);
        it(' should execute : ' + cnt_file, function(done) {
            let cnt_src = item;
            let res_src = dir + '/' + _.replace(cnt_file + '.json', 'src.json', 'result.json');
            let cnt = JSON.parse(fs.readFileSync(cnt_src, 'utf8'));
            debuglog(cnt);
            // console.log(cnt);
            console.log(cnt_src + ':' + res_src)
            let res = JSON.parse(fs.readFileSync(res_src, 'utf8'));
            let fn = helpers[helper];
            console.log(typeof fn);
            if (fn) {
                let parsed = fn(cnt);
                expect(parsed).to.deep.equal(res);
                done();
            } else {
                console.log(util.format('helper file (function) %s not found', cnt_file));
                done();
            }


        });

    });

});
