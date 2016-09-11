'use strict';

var _ = require('lodash');
var deasync = require('deasync');
var orientjs = require('orientjs');
var Promise = require('promise');

var config = require('../utils/config');
var log = require('../utils/logger');

var odbsrv = orientjs({
    host: config.orientdb.host,
    port: config.orientdb.port,
    username: config.orientdb.rootusr,
    password: config.orientdb.rootpwd
});

var db = (function () {
    var done = false;
    var odb;

    odbsrv.list().then(function (dbList) { // db exists?
        if (_.isEmpty(_.find(dbList, function(db) { return db.name === config.orientdb.name}))) {
            log.info('[odb.js] setting up new database');
            return odbsrv.create({
                name: config.orientdb.name,
                type: 'graph',
                storage: 'plocal'
            }).then(function (db) {
                odb = db;
                log.info('[odb.js] setting up new db user');
                return odb.query('SELECT FROM ORole WHERE name IN ["admin","reader","writer"]')
            }).then(function(roles) {
                return odb.insert().into('OUser').set({
                    name: config.orientdb.usr,
                    password: config.orientdb.pwd,
                    status: 'ACTIVE',
                    roles: _.map(roles, function(role) { return role['@rid'] })
                }).one();
            }).catch(function(err) {
                throw err
            })
        } else {
            return Promise.resolve({})
        }
    }).then(function () {
        done = true;
    }).catch(function(err) {
        throw err
    });

    deasync.loopWhile(function(){return !done;});

    return odbsrv.use({
        name: config.orientdb.name,
        username: config.orientdb.usr,
        password: config.orientdb.pwd
    });
})();

module.exports = db;
