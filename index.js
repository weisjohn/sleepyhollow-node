var spawn = require('child_process').spawn
  , EventEmitter = require('events').EventEmitter
  ;

// args is the invocation of phantomjs
function windtalker(args) {

    // the event emitter bridge
    var windtalker = new EventEmitter();

    // the phantomjs process
    var phantomjs = spawn('phantomjs', args);
    phantomjs.on('exit', function() { windtalker.emit('exit'); });
    phantomjs.stderr.on('data', function(data) {
        data.toString().split('\n').forEach(read);
    });

    // the write buffer
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
        windtalker.emit(data.event, data.message);
        if (data.event == "ack") return;
        write({ "event": "ack" });
        _write();
    }

    // event dispatching
    windtalker.on('write', function(event, message) {
        if (event == "ack") throw new Error("ack is a reserved event");
        write({ event: event, message : message });
    });

    return windtalker;
}

module.exports = windtalker;