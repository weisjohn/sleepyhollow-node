
var sleepyhollow = require('../index');

var drjekyll = sleepyhollow('./node_modules/sleepyhollow-phantom/examples/queue.js');

var sites = [ 'http://example.com/', 'http://nodejs.org/', 'http://phantomjs.org/' ];
sites.forEach(function(site) { drjekyll.emit('render', site); });

var renders = 0;
drjekyll.on('rendered', function() {
    renders++;
    if (renders == 3) drjekyll.emit('end');
});
drjekyll.on('exit', function() { process.exit(); })
