'use strict';
const chai = require('chai');
const expect = chai.expect;
const convert = require('../index');
const fs = require('fs');
const _ = require('lodash');
const Glob = require('glob-fs');
const glob = new Glob();
const path = require('path');

chai.use(require('chai-json-schema'));


// console.log(__dirname+'/fixtures');
let files = glob.readdirSync('test/fixtures/**/*.json');
// console.log(files);
let filesC =_.groupBy(files, function(elem){
	return _.last(path.dirname(elem).split('/'));
});
// console.log(filesC);
describe(' ANS Tests', function() {

    describe('Validate types', function() {
    	
            
            _(filesC).forEach(function(item, key) {
            	// console.log(item);
            	// console.log(key);
            	let dir;
                let content_type = key;
                // console.log(content_type);
                dir = path.dirname(item[0]);
               it(' should validate '+ content_type, function(done) {
                    let content, schema;
                    // console.log(srcDirs);
                    content = JSON.parse(fs.readFileSync(dir + '/content.json', 'utf8'));
                    schema = JSON.parse(fs.readFileSync(dir + '/schema.json', 'utf8'));
                    // console.log(content);
                    // console.log(schema);
                    expect(content.good_content).to.be.jsonSchema(schema);
                    // expect(1).to.equal(1);
                    done();
                });

            });
        

    });
    describe(' Convert', function() {

        it('should return a string "hello"', function(done) {
            
            let result = convert.convert();
            // console.log(result);
            expect(result).to.equal('hello');
            done();
        });
    });

});
