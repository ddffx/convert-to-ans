'use strict';
/*
All required tracking data comes here. Could be changed later.

 */
const _ = require('lodash');
const path = require('path');
const bulk = require('bulk-require');
const lib_h = bulk(path.normalize(__dirname + '/..'), ['helpers/**/*.js', '**/*.js']);
const helpers = lib_h.helpers;

exports.parse = item => {
    console.log('parsing tracking object');
    let out = {};
    if (item) {
        if (item.tracking) {
            console.log('Tracking object found, returning as is');
            out = item.tracking;
        } else {
            console.log('Tracking object wasn\'t found, constructing one');
            let authorStr;
            // add author tracking
            if (item.author) {
                // console.log(item.author);
                authorStr = _(item.author).chain().map(function(author) {
                    // console.log(_.get(author, 'name'));
                    return _.get(author, 'name');
                }).join(', ').value();
                // console.log(authorStr);
                out.authors = authorStr;
            }
            // add section & sub section tracking
            if (item.blog_section) {
                let section_obj = helpers.parseSection(item.blog_section);
                if (section_obj) {
                    out.section = section_obj.section;

                    if (section_obj.sub_section) {
                        out.subsection = section_obj.sub_section;
                    }
                }
            }
        }

        return {
            tracking: out
        };

    } else {
        console.log('tracking parsing failed');
        return {
            error: {
                message: 'tracking parsing failed'
            }
        };
    }


};
