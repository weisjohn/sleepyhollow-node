
var sleepyhollow = require('./');

var drjekyll = sleepyhollow(['phantom.js']);

drjekyll.on('open', function() {
    console.log('open')
})

drjekyll.on('render', function() {
    console.log('render')
})

drjekyll.on('exit', function() {
    console.log('exit')
    process.exit();
})

setInterval(function() {
    drjekyll.emit('hello');
}, 1e3)



drjekyll.on('ack', function(value) {
    console.log('phantomjs:', value)
})