'use strict';
const _ = require('lodash');
module.exports = function(authorObj) {
	// console.log(authorObj);
    if (authorObj) {
        let author = {};
       _.assign(author, _.pick(authorObj, ['id','slug','name','description','first_name','last_name','url','nickname']));
        // console.log(author);
        return author;
    } else{
    	return null;
    }

};
