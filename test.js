
var windtalker = require('./');

var talker = windtalker(['phantom.js']);

talker.on('open', function() {
    console.log('open')
})

talker.on('render', function() {
    console.log('render')
})

talker.on('exit', function() {
    process.exit();
})