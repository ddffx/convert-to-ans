'use strict';
const _ = require('lodash');
const $ = require('cheerio');
module.exports = function(content_elements, meta) {
    
    // console.log('replacing ombeds');
    // console.log(content_elements.length);
    if (!_.isEmpty(content_elements)) {
        _.each(content_elements, function(element) {
            
            if (element.type === 'oembed') {
                _.each(meta, function(value, key) {
                    
                    if(key.indexOf('_oembed_') === 0 && key.indexOf('_time_') < 0){
                    	// console.log(key);
                    	if(!_.isEmpty(value)){
                    		// parse and extract the url from href;
                    		$(value).find('a').each(function(item){
                    			if($(this).attr('href') === element.objectUrl){

                    				element.raw_html = value;
                    				// console.log(element);
                    			}
                    		});
                    	}
                    }
                });
            }
        });
    }

    return content_elements;
};
