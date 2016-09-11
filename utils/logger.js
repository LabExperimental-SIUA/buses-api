var bunyan = require("bunyan");

function consoleStream() {}
consoleStream.prototype.write = function (record) {
    console.log('[%s] %s: %s',
        record.time.toISOString(),
        bunyan.nameFromLevel[record.level],
        record.msg);
};

var stdout = new consoleStream();
var log = bunyan.createLogger({
    name: 'buses engine-js logger',
    streams: [
        { level: "debug", type: "raw", stream: stdout },
        { level: "info", type: "raw", stream: stdout },
        { level: "warn", type: "raw", stream: stdout },
        { level: "error", type: "raw", stream: stdout },
        { level: "fatal", type: "raw", stream: stdout }
    ]
});

module.exports = log;
