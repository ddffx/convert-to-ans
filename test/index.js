'use strict';
const chai = require('chai');
const expect = chai.expect;
const convert = require('../index');
const fs = require('fs');
const _ = require('lodash');
const Glob = require('glob-fs');
const glob = new Glob();
const path = require('path');
const request = require('request');
const util = require('util');
chai.use(require('chai-json-schema'));

let files = glob.readdirSync('test/fixtures/**/*.json');
// console.log(files);
let filesC = _.groupBy(files, function(elem) {
    return _.last(path.dirname(elem).split('/'));
});
// console.log(filesC);
// update schema from ur

// chai.tv4.dropSchemas();
// console.log(chai.tv4.getSchemaUris());

_(filesC).forEach((item, key) => {
    let dir, schema, list;
    dir = path.dirname(item[0]);
    schema = JSON.parse(fs.readFileSync(dir + '/schema.json', 'utf8'));
    chai.tv4.addSchema(schema);
    list = chai.tv4.getMissingUris();
    // console.log(list);
    _(list).forEach(uri => {
        console.log(util.format('loading schema %s', uri));
        request(uri, function(err, response, schema) {
            if (err) {
                // console.log(err);
                // throw err;
            } else {
                // console.log(schema);
                try {
                    chai.tv4.addSchema(uri, schema);
                } catch (err) {
                    throw err;
                }

            }

        });
    });
});
// make sure to run mocha command with --delay flag
setTimeout(function() {
    describe(' ANS Tests', function() {
        describe('Validate types', function() {


            _(filesC).forEach(function(item, key) {
                // console.log(item);
                // console.log(key);
                let dir;
                let content_type = key;
                // console.log(content_type);
                dir = path.dirname(item[0]);
                it(' should validate ' + content_type, function(done) {
                    let content, schema;
                    // console.log(srcDirs);
                    content = JSON.parse(fs.readFileSync(dir + '/content.json', 'utf8'));
                    schema = JSON.parse(fs.readFileSync(dir + '/schema.json', 'utf8'));
                    // console.log(content);
                    // console.log(schema);
                    expect(content).to.be.jsonSchema(schema);
                    done();
                });

            });


        });
        // describe(' Convert', function() {

        //     it('should return a string "hello"', function(done) {

        //         let result = convert.convert();
        //         // console.log(result);
        //         expect(result).to.equal('hello');
        //         done();
        //     });
        // });

    });
    run();
}, 5000);
