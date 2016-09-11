'use strict';

var _ = require('lodash');
var moment = require('moment');
var Promise = require('promise');
var uuid = require('node-uuid');

var odb = require('../data/odb');

var traces = {

    create: function (deviceId, recordedOn) {
        var traceId = uuid.v4();
        return odb.insert().into('Trace').set({
            id: traceId,
            deviceId: deviceId,
            recordedOn: recordedOn,
            createdOn: new Date(),
            lastUpdatedOn: new Date()
        }).one().then(function () {
            return traceId
        }).catch(function (err) {
            throw err
        })
    },

    addPoints: function (traceId, deviceId, recordedOn, points) {
        return Promise.all(_.map(points, function (point) {
            return odb.insert().into('Location').set({
                traceId: traceId,
                deviceId: deviceId,
                point: {
                    '@type': 'd',
                    '@class': 'Point',
                    latitude: point.latitude,
                    longitude: point.longitude
                },
                recordedOn: recordedOn,
                createdOn: new Date(),
                lastUpdatedOn: new Date()
            }).one()
        })).then(function (points) {
            return Promise.resolve(points.length)
        }).catch(function (err) {
            throw err
        })
    },

    addStop: function (traceId, deviceId, recordedOn, stop) {
        return odb.insert().into('Location').set({
            traceId: traceId,
            deviceId: deviceId,
            stop: true,
            point: {
                '@type': 'd',
                '@class': 'Point',
                latitude: stop.latitude,
                longitude: stop.longitude
            },
            recordedOn: recordedOn,
            createdOn: new Date(),
            lastUpdatedOn: new Date()
        }).one().then(function () {
            return Promise.resolve(1)
        }).catch(function (err) {
            throw err
        })
    },

    addMetadata: function (traceId, deviceId, recordedOn, code, name, price) {
        return odb.update('Trace').set({
            routeCode: code,
            routeName: name,
            routePrice: price,
            lastUpdatedOn: new Date()
        }).where({
            id: traceId
        }).scalar().catch(function (err) {
            throw err
        })
    },

    getMetadata: function () {
        var query = 'SELECT FROM Trace';
        return odb.query(query).then(function (results) {
            return results;
        });
    },

    setStatus: function(traceId, status) {
        if (status !== 'finished' && status !== 'discarded') {
            throw new Error('Unknown status: ' + status)
        }

        return odb.update('Trace').set({
            status: status,
            lastUpdatedOn: new Date()
        }).where({
            id: traceId
        }).scalar().catch(function (err) {
            throw err
        })
    }

};

module.exports = traces;
