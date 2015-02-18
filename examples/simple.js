var sleepyhollow = require('sleepyhollow-node');
var drjekyll = sleepyhollow('./node_modules/sleepyhollow-phantom/examples/simple.js');

drjekyll.on("error", function(obj) {
    console.log(obj);
});

drjekyll.emit('render', "http://example.net/");
drjekyll.on('rendered', function() {
    console.log('a page was rendered');
    drjekyll.emit('end');
});