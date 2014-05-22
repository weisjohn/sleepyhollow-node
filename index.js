var spawn = require('child_process').spawn
  , EventEmitter = require('events').EventEmitter
  ;

function necromancer(args) {

    // the modified event-emitter bridge
    var necromancer = new EventEmitter();
    _emit = necromancer.emit;
    necromancer.emit = function(event, message) {
        if (event !== "ack") write({ event: event, message : message });
        _emit.apply(necromancer, Array.prototype.slice.call(arguments, 0));
    }

    // the phantomjs process
    var phantomjs = spawn('phantomjs', args);
    phantomjs.on('exit', function() { necromancer.emit('exit'); });
    phantomjs.stderr.on('data', function(data) {
        data.toString().split('\n').forEach(read);
    });

    // the writing mechanism, which drains periodically
    var writeBuffer = [];
    function write(obj) { writeBuffer.push(JSON.stringify(obj)); }
    function _write() {
        phantomjs.stdin.write(writeBuffer.join("\v") + "\n");
        writeBuffer = [];
    }

    // the read mechanism that selectively writes
    function read(data) {
        if (!data) return;
        try { data = JSON.parse(data) }
        catch (e) { console.log(e, data); throw new Error(e); }
        _emit.apply(necromancer, [data.event, data.message]);
        if (data.event == "ack") return;
        write({ "event": "ack" });
        _write();
    }

    return necromancer;
}

module.exports = necromancer;