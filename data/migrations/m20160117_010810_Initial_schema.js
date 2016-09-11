"use strict";

var promise = require('promise');

exports.name = "Initial schema";

exports.up = function (db) {
    return db.class.create('Point').then(function(point) {
        return promise.all([
            point.property.create({name: 'latitude', type: 'Double'}),
            point.property.create({name: 'longitude', type: 'Double'})
        ])
    }).then(function() {
        return db.class.create('BusStop', 'V')
    }).then(function(busStop) {
        return promise.all([
            busStop.property.create({name: 'name', type: 'String'}),
            busStop.property.create({name: 'location', type: 'EMBEDDED', linkedClass: 'Point'}),
            busStop.property.create({name: 'routes', type: 'EMBEDDEDLIST', linkedType: 'String'})
        ])
    }).then(function() {
        return db.class.create('Travel', 'E')
    }).then(function(travel) {
        return promise.all([
            travel.property.create({name: 'route', type: 'String'}),
            travel.property.create({name: 'path', type: 'EMBEDDEDLIST', linkedClass: 'Point'})
        ])
    }).catch(function(err) {
        throw err
    })
};

exports.down = function (db) {
    return db.class.drop('Travel').then(function() {
        return db.class.drop('BusStop')
    }).then(function() {
        return db.class.drop('Point')
    }).catch(function(err) {
        throw err
    })
};
