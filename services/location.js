'use strict';

var _ = require('lodash');
var moment = require('moment');
var promise = require('promise');

var odb = require('../data/odb');

var location = {

    create: function(point, timestamp, device) {
        return odb.insert().into('Location').set({
            point: {
                '@type': 'd',
                '@class': 'Point',
                latitude: point.latitude,
                longitude: point.longitude
            },
            recordedOn: new Date(timestamp),
            createdOn: new Date(),
            lastUpdatedOn: new Date(),
            device: device
        }).one().then(function(location) {
            return location
        }).catch(function(err) {
            throw err
        })
    },

    getLatest: function(device) {
        var query = "SELECT FROM Location WHERE @rid in (SELECT locationId FROM (SELECT @rid as locationId, max(recordedOn) FROM Location WHERE device = :device)) LIMIT 1";
        return odb.query(query, {
            params: {
                device: device
            }
        }).then(function(results) {
            if (results.length > 0) {
                return results[0]
            } else {
                return {}
            }
        }).catch(function(err) {
            throw err
        })
    }
};

module.exports = location;
