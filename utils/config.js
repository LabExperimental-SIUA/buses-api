'use strict';

var config = {
    orientdb: {
        host: process.env.BUSES_ODB_HOST || 'localhost',
        port: parseInt(process.env.BUSES_ODB_PORT || 2424),
        rootusr: process.env.BUSES_ODB_ROOT_USR || 'root',
        rootpwd: process.env.BUSES_ODB_ROOT_PWD || 'root',
        name: process.env.BUSES_ODB_NAME || 'buses',
        usr: process.env.BUSES_ODB_USR || 'root',
        pwd: process.env.BUSES_ODB_PWD || 'root'
    }
};

module.exports = config;
