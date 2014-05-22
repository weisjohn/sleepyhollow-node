
var necromancer = require('./');

var talker = necromancer(['phantom.js']);

talker.on('open', function() {
    console.log('open')
})

talker.on('render', function() {
    console.log('render')
})

talker.on('exit', function() {
    process.exit();
})