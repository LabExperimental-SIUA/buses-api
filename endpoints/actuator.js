'use strict';

var actuator = {
    health: function(req, res) {
        return res.status(200).json({status: 'up and running!'})
    }
};

module.exports = actuator;
