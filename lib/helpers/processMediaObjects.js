'use strict';
const _ = require('lodash');
module.exports = function(imgObj) {

    if (imgObj) {
        let img = {
            created_date: imgObj.date,
            last_updated_date: imgObj.modified,

            title: _.get(imgObj, 'title.rendered', ''),
            copyright: _.get(imgObj, 'media_details.image_meta.copyright', ''),
            credit: _.get(imgObj, 'media_details.image_meta.credit', ''),
            type: imgObj.media_type
        };
        if (imgObj.media_details && imgObj.media_details.sizes) {
            // console.log(imgObj.media_details.sizes);
            img.sizes = _.pick(imgObj.media_details.sizes, ['thumbnail', 'full', 'medium']);
            // remove file fields
            _.unset(img.sizes, 'thumbnail.file');
            _.unset(img.sizes, 'full.file');
            _.unset(img.sizes, 'medium.file');
        }
        _.assign(img, _.pick(imgObj, ['caption', 'mime_type', 'source_url' ]));
        img.version = '';
        return img;
    } else{
    	return null;
    }

};