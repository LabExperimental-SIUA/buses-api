'use strict';

var _ = require('lodash');

var services = require('../services');
var utils = require('../utils/utils');

var routes = {

    create: function(req, res, next) {
        var route = req.body;
        if (_.isEmpty(route)) {
            var err = new Error('Missing required route object parameter');
            err.status = 400;
            return next(err);
        }

        if (_.isEmpty(route.id) || _.isEmpty(route.stops) || _.isEmpty(route.path)) {
            var err = new Error('Missing a required property value in payload object: routeId, stops or path');
            err.status = 400;
            return next(err);
        }

        return services.routes.create(route.id, route.stops, route.path).then(function() {
            return res.status(200).json({
                route: route.id
            })
        }).catch(function(err) {
            return next(err)
        })
    },

    getById: function(req, res, next) {
        var routeId = req.params.id;

        if (_.isEmpty(routeId)) {
            var err = new Error('Missing required path parameter id');
            err.status = 400;
            return next(err)
        }

        return services.routes.getById(routeId).then(function(result) {
            if (result === undefined) {
                var err = new Error('Resource not found: ' + routeId);
                err.status = 404;
                return next(err);
            } else {
                return res.status(200).json(utils.detachOdbRecord(result))
            }
        }).catch(function (err) {
            return next(err)
        })
    },

    getRouteIds: function(req, res, next) {
        return services.routes.getRouteIds().then(function(result) {
            return res.status(200).json(utils.detachOdbRecord(result))
        }).catch(function (err) {
            return next(err)
        })
    }
};

module.exports = routes;
