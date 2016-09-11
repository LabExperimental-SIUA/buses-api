'use strict';

var _ = require('lodash');

var services = require('../services');
var utils = require('../utils/utils');

var traces = {

    create: function(req, res, next) {
        var trace = req.body;

        if (_.isEmpty(trace)) {
            var err = new Error('Missing required trace object parameter');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace.deviceId) || _.isEmpty(trace.timestamp)) {
            var err = new Error('Missing a required property value in payload object: deviceId or timestamp');
            err.status = 400;
            return next(err);
        }

        var recordedOn = new Date(trace.timestamp);

        return services.traces.create(trace.deviceId, recordedOn).then(function(traceId) {
            return res.status(200).json({
                traceId: traceId
            })
        }).catch(function(err) {
            return next(err)
        })
    },

    addPoints: function(req, res, next) {
        var trace = req.body;
        var traceId = req.params.traceId;

        if (_.isEmpty(traceId)) {
            var err = new Error('Missing required traceId parameter');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace)) {
            var err = new Error('Missing required request body object');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace.deviceId) || _.isEmpty(trace.timestamp) ||
            _.isEmpty(trace.points) || !_.isArray(trace.points)) {
            var err = new Error('Missing a required property value in payload object: deviceId, timestamp or points');
            err.status = 400;
            return next(err);
        }

        var recordedOn = new Date(trace.timestamp);

        return services.traces.addPoints(traceId, trace.deviceId, recordedOn, trace.points).then(function(count) {
            return res.status(200).json({count: count})
        }).catch(function(err) {
            return next(err)
        })
    },

    addStop: function(req, res, next) {
        var trace = req.body;
        var traceId = req.params.traceId;

        if (_.isEmpty(traceId)) {
            var err = new Error('Missing required traceId parameter');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace)) {
            var err = new Error('Missing required request body object');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace.deviceId) || _.isEmpty(trace.timestamp) ||
            _.isEmpty(trace.stop) || !_.isObject(trace.stop)) {
            var err = new Error('Missing a required property value in payload object: deviceId, timestamp or stop');
            err.status = 400;
            return next(err);
        }

        var recordedOn = new Date(trace.timestamp);

        return services.traces.addStop(traceId, trace.deviceId, recordedOn, trace.stop).then(function(count) {
            return res.status(200).json({count: count})
        }).catch(function(err) {
            return next(err)
        })
    },

    addMetadata: function(req, res, next) {
        var trace = req.body;
        var traceId = req.params.traceId;

        if (_.isEmpty(traceId)) {
            var err = new Error('Missing required traceId parameter');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace)) {
            var err = new Error('Missing required request body object');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace.deviceId) || _.isEmpty(trace.timestamp)) {
            var err = new Error('Missing a required property value in payload object: deviceId or timestamp');
            err.status = 400;
            return next(err);
        }

        var recordedOn = new Date(trace.timestamp);

        return services.traces.addMetadata(traceId, trace.deviceId, recordedOn,
            trace.routeCode, trace.routeName, trace.routePrice).then(function(count) {
            return res.status(200).json({count: count})
        }).catch(function(err) {
            return next(err)
        })
    },

    getMetadata: function(req, res, next) {
        return services.traces.getMetadata().then(function(metadata) {
            return res.status(200).json(metadata)
        }).catch(function(err) {
            return next(err)
        })
    },

    setStatus: function(req, res, next) {
        var trace = req.body;
        var traceId = req.params.traceId;

        if (_.isEmpty(traceId)) {
            var err = new Error('Missing required traceId parameter');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace)) {
            var err = new Error('Missing required request body object');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(trace.status)) {
            var err = new Error('Missing a required property value in payload object: status');
            err.status = 400;
            return next(err);
        }

        return services.traces.setStatus(traceId, trace.status).then(function(count) {
            return res.status(200).json({count: count})
        }).catch(function(err) {
            return next(err)
        })
    }
};

module.exports = traces;
