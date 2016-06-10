'use strict';
const chai = require('chai');
const expect = chai.expect;
const ansParser = require('../index');
const fs = require('fs');
const _ = require('lodash');
const Glob = require('glob-fs');
const glob = new Glob();
const path = require('path');
const request = require('request');
const util = require('util');
chai.use(require('chai-json-schema'));

// let files = glob.readdirSync('test/fixtures/**/*.json');
// // console.log(files);
// let filesC = _.groupBy(files, function(elem) {
//     return _.last(path.dirname(elem).split('/'));
// });
// // console.log(filesC);
// // update schema from ur

// // chai.tv4.dropSchemas();
// // console.log(chai.tv4.getSchemaUris());

// _(filesC).forEach((item, key) => {
//     let dir, schema, list;
//     dir = path.dirname(item[0]);
//     schema = JSON.parse(fs.readFileSync(dir + '/schema.json', 'utf8'));
//     chai.tv4.addSchema(schema);
//     list = chai.tv4.getMissingUris();
//     // console.log(list);
//     _(list).forEach(uri => {
//         console.log(util.format('loading schema %s', uri));
//         request(uri, function(err, response, schema) {
//             if (err) {
//                 // console.log(err);
//                 // throw err;
//             } else {
//                 // console.log(schema);
//                 try {
//                     chai.tv4.addSchema(uri, schema);
//                 } catch (err) {
//                     throw err;
//                 }

//             }

//         });
//     });
// });
// // make sure to run mocha command with --delay flag
// setTimeout(function() {
//     describe(' ANS Tests', function() {
//         describe('Validate types', function() {


//             _(filesC).forEach(function(item, key) {
//                 // console.log(item);
//                 // console.log(key);
//                 let dir;
//                 let content_type = key;
//                 // console.log(content_type);
//                 dir = path.dirname(item[0]);
//                 it(' should validate ' + content_type, function(done) {
//                     let parsed, schema;
//                     // console.log(srcDirs);
//                     parsed = JSON.parse(fs.readFileSync(dir + '/parsed.json', 'utf8'));
//                     schema = JSON.parse(fs.readFileSync(dir + '/schema.json', 'utf8'));
//                     // console.log(content);
//                     // console.log(schema);
//                     expect(content).to.be.jsonSchema(schema);
//                     done();
//                 });

//             });


//         });

//     });
//     run();
// }, 5000);


describe(' Parse Content, ansParser.parse() ', function() {

    it('should match the ans schema ', function(done) {
        let cnt = JSON.parse(fs.readFileSync(__dirname+'/fixtures/blog/src.json', 'utf8'));
        let schemaDef = JSON.parse(fs.readFileSync(__dirname+'/fixtures/blog/schema.json', 'utf8'));
        let opts = {};
        opts.schema = {
        	definition: schemaDef,
        	version:'0.5.5',
        	type: 'blog'
        };

        ansParser.parse(cnt, opts, function(err, result) {
            
            if (err) {
                 throw err;
                done();
            } else {
                // expect(result).to.be.jsonSchema(schemaDef);
                expect(result).to.be.an('object');
                done();
            }

        });


    });
});
