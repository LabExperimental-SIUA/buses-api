'use strict';

var _ = require('lodash');
var moment = require('moment');
var promise = require('promise');

var odb = require('../data/odb');

var routes = {

    create: function(routeId, stops, path) {
        return promise.all(_.map(stops, function(stop) {
            return odb.create('VERTEX', 'BusStop').set({
                location: {
                    '@type': 'd',
                    '@class': 'Point',
                    latitude: stop.location.latitude,
                    longitude: stop.location.longitude
                },
                name: stop.name,
                routes: [routeId],
                createdOn: new Date(),
                lastUpdatedOn: new Date()
            }).one()
        })).then(function(stopVertexes) {
            var persistedStops = _.reduce(stopVertexes, function(stops, stop) {
                stops[stop.location.latitude + ',' + stop.location.longitude] = stop;
                return stops
            }, {});

            var from, to;
            var points = [];
            var promises = [];
            _.forEach(path, function(point) {
                var stop = persistedStops[point.latitude + ',' + point.longitude];

                if (!_.isEmpty(stop)) {
                    if (_.isEmpty(from)) {
                        from = stop;
                        points = []
                    } else if (_.isEmpty(to)) {
                        to = stop;
                        promises.push(
                            odb.create('EDGE', 'Travel')
                                .from(from['@rid'])
                                .to(to['@rid'])
                                .set({
                                    route: routeId,
                                    path: _.map(points, function(point) {
                                        return {
                                            '@type': 'd',
                                            '@class': 'Point',
                                            latitude: point.latitude,
                                            longitude: point.longitude
                                        }
                                    })
                                })
                                .one()
                        );
                        from = to;
                        to = undefined;
                        points = []
                    }
                } else {
                    points.push(point)
                }
            });

            return promises
        }).catch(function(err) {
            throw err
        })
    },

    getById: function(routeId) {
        var query = "SELECT FROM (TRAVERSE out(), outE('Travel') FROM (SELECT FROM BusStop WHERE :routeId IN routes)) WHERE route = :routeId OR :routeId IN routes";
        return odb.query(query, {params: {routeId: routeId}}).then(function(results) {
            var start = _.reduce(results, function(resultPrev, resultCurr) {
                if (resultCurr['@class'] === 'BusStop') {
                    return resultPrev.createdOn > resultCurr.createdOn ? resultCurr : resultPrev;
                } else {
                    return resultPrev
                }
            }, { notfound: true, createdOn: moment().add(1,'day').toDate() });

            if (start.notfound === true) {
                return undefined
            }

            var stops = [];
            var path = [];

            var _traverse = function(stop, visited) {
                stops.push(stop);
                path.push(stop.location);
                visited.push(stop);

                var travel = stop.out_Travel && stop.out_Travel.all()[0];
                if (!_.isEmpty(travel)) {
                    _.forEach(travel.path, function(point) {
                        path.push(point);
                    });

                    var to = travel.in;
                    if (!_.includes(visited, to)) {
                        _traverse(to, visited)
                    }
                }
            };

            if (!_.isEmpty(start)) {
                _traverse(start, []);
            }

            return {
                id: routeId,
                stops: stops,
                path: path
            }

        }).catch(function(err) {
            throw err
        })
    },

    getRouteIds: function() {
        var query = 'SELECT distinct(value) AS route FROM (SELECT expand(routes) FROM BusStop) ORDER BY route ASC';
        return odb.query(query).then(function(results) {
            return _.map(results, function(result) {
                return result.route
            })
        }).catch(function(err) {
            throw err
        })
    }
};

module.exports = routes;
