'use strict';
const _ = require('lodash');
const cheerio = require('cheerio');
const he = require('he');
const _getTweetObj = (el) => {
    let obj_url;
    let $ = cheerio.load(el, {
        decodeEntities: false
    });
    let $el = $(el);
    $el.find('a').each(function(i, elem) {
        let url = $(this).attr('href');
        if (url.match(/^https:\/\/twitter.com\/\w+\/status\/\d+$/)) {
            obj_url = url;
        }
    });

    return {
        type: 'oembed',
        raw_html: $.html(),
        objectUrl: obj_url || '',
        providerUrl: ''
    };
};
const _getInstagramObj = (el) => {
    let obj_url;
    let $ = cheerio.load(el);
    let $el = $(el);
    $el.find('a').each(function(i, elem) {
        let url = $(this).attr('href');
        if (url.match(/^https:\/\/www.instagram.com/)) {
            obj_url = url;
        }
    });

    return {
        type: 'oembed',
        raw_html: he.decode($.html()),
        objectUrl: obj_url || '',
        providerUrl: ''
    };
};
const _getIframeObj = (el) => {
    let iframe, obj_url;
    let $ = cheerio.load(el);
    let $el = $(el);
    iframe = $el.find('iframe');
    obj_url = iframe.attr('src');
    // console.log(iframe.get(0).attribs);
    if (obj_url) {
        return {
            type: 'oembed',
            raw_html: $.html(),
            objectUrl: obj_url || '',
            providerUrl: '',
            addtional_properties: _.isObject(iframe.get(0).attribs)? iframe.get(0).attribs : {}
        };
    } else{
        return null;
    }

};

const _getPostTVObj = (el) => {
    let obj_url;
    let $ = cheerio.load(el);
    let $el = $(el);

    let uuid = $(el).data('uuid');
    if(uuid){
        obj_url = 'https://www.washingtonpost.com/posttv/oembed/videos?uuid='+uuid;
    }

    return {
        type: 'oembed',
        raw_html: he.decode($.html()),
        objectUrl: obj_url || '',
        providerUrl: 'https://www.washingtonpost.com'
    };

};


exports.parse = elem => {
    if (_.isString(elem)) { // mostly for test content
        elem = elem.replace(/\n|\t/gi, ''); // remove new lines;
        elem = cheerio.parseHTML(elem)[0]; // first child
    }
    let $ = cheerio.load(elem);
    let $elem = $(elem);
    if (elem.attribs.class && elem.attribs.class.match(/twitter\-tweet/)) {
        return _getTweetObj(elem);
    } else if (elem.attribs.class && elem.attribs.class.match(/instagram\-media/)) {
        return _getInstagramObj(elem);
    } else if ($elem.children().length && $elem.children().get(0).tagName === 'iframe') {
        return _getIframeObj(elem);
    }  else if (elem.attribs.class && elem.attribs.class.match(/posttv-video-embed/)) {
        return _getPostTVObj(elem);
    } else {

        return {
            type: 'raw_html',
            content: $.html()
        };
    }


};
