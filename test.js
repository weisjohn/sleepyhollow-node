
var necromancer = require('./');

var talker = necromancer(['phantom.js']);

talker.on('open', function() {
    console.log('open')
})

talker.on('render', function() {
    console.log('render')
})

talker.on('exit', function() {
    console.log('exit')
    process.exit();
})

setInterval(function() {
    talker.emit('hello');
    // talker.emit('ack')
}, 1e3)



talker.on('ack', function(value) {
    console.log('phantomjs:', value)
})