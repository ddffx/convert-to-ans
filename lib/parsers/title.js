'use strict';
// const _ = require('lodash');
exports.parse = item => {
  
    if (item && item.title && item.title.rendered) {
        return {
            title: item.title.rendered
        };
    } else {
        return {
            title_parse_error: 'PARSING_FAILED'
        };
    }


};
