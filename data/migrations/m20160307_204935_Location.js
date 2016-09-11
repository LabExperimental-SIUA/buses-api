"use strict";

var Promise = require('promise');

exports.name = "Location";

exports.up = function (db) {
    return db.class.create('Location').then(function(location) {
        return Promise.all([
            location.property.create({name: 'point', type: 'EMBEDDED', linkedClass: 'Point'}),
            location.property.create({name: 'recordedOn', type: 'DATETIME'}),
            location.property.create({name: 'createdOn', type: 'DATETIME'}),
            location.property.create({name: 'lastUpdatedOn', type: 'DATETIME'}),
            location.property.create({name: 'device', type: 'String'})
        ])
    }).catch(function(err) {
        throw err
    })
};

exports.down = function (db) {
    return db.class.drop('Location').catch(function(err) {
        throw err
    });
};

