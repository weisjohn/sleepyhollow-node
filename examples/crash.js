
var sleepyhollow = require('../index');

var drjekyll = sleepyhollow('./node_modules/sleepyhollow-phantom/examples/crash.js');

drjekyll.emit("render", "http://example.net");

setTimeout(function() {
    // drjekyll.emit('end');
    throw new Error("some sort of error");
}, 1e3);


