'use strict';

var _ = require('lodash');

var utils = {

    detachOdbRecord: function (object) {
        if (_.isArray(object)) {
            _.forEach(object, function (element) {
                utils.detachOdbRecord(element)
            })
        } else if (_.isObject(object)) {
            _.forIn(object, function (val, key) {
                if (_.startsWith(key, '@') ||
                    _.startsWith(key, 'in_') ||
                    _.startsWith(key, 'out_') ||
                    'in' === key ||
                    'out' === key
                ) {
                    delete object[key]
                } else {
                    utils.detachOdbRecord(val)
                }
            })
        }

        return object
    }
};

module.exports = utils;
