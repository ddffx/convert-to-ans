'use strict';
const _ = require('lodash');
const _parseSection = (sectionStr) => {
    let out;
    if (sectionStr) { //ex: sports/olympics/latest
        let re = /([\w\-]+)\/(.*)/;
        let parts = re.exec(sectionStr);
        let section, sub_section;
        out = {};
        if (parts) {
            if (parts[1]) {
                out.section = parts[1];
            }
            if (parts[2]) {
                out.sub_section = parts[2];
            }

        } else {
            out.section = sectionStr;
        }
    }
    if (_.isEmpty(out)) {
        return null;
    } else {
        return out;
    }
};
module.exports = _parseSection;

