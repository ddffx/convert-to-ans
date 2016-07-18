'use strict';
/**
 * Convert title in to a headline object
 * @type {
 *       basic: 'W basic blog title',
 *       twitter: 'THis one is formatted for twitter'
 * }
 */
// const _ = require('lodash');
exports.parse = item => {

    if (item && item.title && item.title.rendered) {
        return {
            headlines: {
                basic: item.title.rendered
                // twitter
                // web, mobile, rainbow etc could be added in the future
            }
        };
    } else {
        return {
            headlines_parse_error: 'PARSING_FAILED'
        };
    }


};
