'use strict';

var _ = require('lodash');

var services = require('../services');
var utils = require('../utils/utils');

var location = {

    create: function(req, res, next) {
        var point = req.body;
        if (_.isEmpty(point)) {
            var err = new Error('Missing required payload object parameter');
            err.status = 400;
            return next(err);
        }

        if (!_.isNumber(point.latitude) || !_.isNumber(point.longitude) || !_.isNumber(point.timestamp) || _.isEmpty(point.device)) {
            var err = new Error('Missing a required property value in payload object: latitude, longitude, timestamp or device');
            err.status = 400;
            return next(err);
        }

        return services.location.create(point, point.timestamp, point.device).then(function(result) {
            return res.status(200).json(utils.detachOdbRecord(result))
        }).catch(function(err) {
            return next(err)
        })
    },

    getLatest: function(req, res, next) {
        var device = req.params.device;

        if (_.isEmpty(device)) {
            var err = new Error('Missing required parameter device');
            err.status = 400;
            return next(err);
        }

        return services.location.getLatest(device).then(function(result) {
            return res.status(200).json(utils.detachOdbRecord(result))
        }).catch(function (err) {
            return next(err)
        })
    }
};

module.exports = location;
