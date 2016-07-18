'use strict';
/*
All required meta data that are not mapped to any single element comes here. Could be changed later.

 */
const _ = require('lodash');
exports.parse = item => {
    console.log('parsing meta');
    let out;
    if (item && item.meta) {
        out = _.omitBy(item.meta, function(value, key){
            return _.startsWith(key, '_'); // remove items that strats with _
        });
        // ad sticky
        if(item.sticky){
            out.sticky = item.sticky;
        }

        console.log('meta parsing success!')
        return {
            meta: out
        };
    } else {
        console.log('meta parsing failed');
        return {
            meta_parse_error: 'PARSING_FAILED'
        };
    }


};
