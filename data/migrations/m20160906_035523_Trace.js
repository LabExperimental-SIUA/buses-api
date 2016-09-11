"use strict";

const Promise = require('promise');

exports.name = "Trace";

exports.up = function (db) {
    return db.class.create('Trace').then(function(trace) {
        return Promise.all([
            trace.property.create({name: 'id', type: 'String'}),
            trace.property.create({name: 'device', type: 'String'}),
            trace.property.create({name: 'recordedOn', type: 'DATETIME'}),
            trace.property.create({name: 'createdOn', type: 'DATETIME'}),
            trace.property.create({name: 'lastUpdatedOn', type: 'DATETIME'})
        ])
    }).catch(function(err) {
        throw err
    })
};

exports.down = function (db) {
  // @todo implementation
};

