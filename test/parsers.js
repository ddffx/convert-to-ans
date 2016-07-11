'use strict';
const util = require('util');
const debuglog = util.debuglog('ans');
const chai = require('chai');
const expect = chai.expect;
const fs = require('fs');
const _ = require('lodash');
const bulk = require('bulk-require');
const lib = bulk(process.cwd() + '/lib', ['parsers/**/*.js', '**/*.js']);

const parsers = lib.parsers;
debuglog(lib);

const Glob = require('glob-fs');
const glob_html = new Glob();
const glob_json = new Glob();
const path = require('path');

let html_files = glob_html.readdirSync('test/fixtures/parsers/*.html');

let json_src_files = glob_json.readdirSync('test/fixtures/parsers/*-src.json');
debuglog(html_files);
debuglog(json_src_files);


describe(' Parse html into ans format ', function() {

    _(html_files).forEach(function(item) {
        // console.log(item);
        // console.log(key);
        let cnt_file = path.basename(item, '.html');
        let parser = cnt_file.indexOf('-')> 0 ? cnt_file.split('-')[0]: cnt_file;
        let dir = path.dirname(item);
        console.log(parser);
        it(' should parse tag: ' + cnt_file, function(done) {
            let cnt_src = item;
            let res_src = dir+'/' + cnt_file + '-ans.json';
            let cnt = fs.readFileSync(cnt_src, 'utf8');
            debuglog(cnt);
            let res = JSON.parse(fs.readFileSync(res_src, 'utf8'));
            let parsed = parsers[parser].parse(cnt);
            // console.log(parsed);
            expect(parsed).to.deep.equal(res);
            done();
        });

    });

});

describe(' Parse wordpress elements into ans format ', function() {

    _(json_src_files).forEach(function(item) {
        // console.log(item);
        // console.log(key);
        let cnt_file = path.basename(item, '.json').split('-')[0]; // remove src
        let parser = cnt_file.indexOf('-')> 0 ? cnt_file.split('-')[0]: cnt_file;
        let dir = path.dirname(item);
        // console.log(parser);
        it(' should parse : ' + cnt_file, function(done) {
            let cnt_src = item;
            let res_src = dir+'/' + cnt_file + '-ans.json';
            let cnt = JSON.parse(fs.readFileSync(cnt_src, 'utf8'));
            debuglog(cnt);
            let res = JSON.parse(fs.readFileSync(res_src, 'utf8'));
            let parsed = parsers[parser].parse(cnt);
            console.log(parsed);
            expect(parsed).to.deep.equal(res);
            done();
        });

    });

});
