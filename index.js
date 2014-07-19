var spawn = require('child_process').spawn
  , EventEmitter = require('events').EventEmitter
  ;

function sleepyhollow() {

    // the modified event-emitter bridge
    var sleepyhollow = new EventEmitter();
    _emit = sleepyhollow.emit;
    sleepyhollow.emit = function(event, message) {
        if (event !== "ack") write({ event: event, message : message });
        _emit.apply(sleepyhollow, Array.prototype.slice.call(arguments, 0));
    }

    // the phantomjs process
    var args = Array.prototype.slice.call(arguments, 0);
    var phantomjs = spawn.apply(null, ['phantomjs', args]);
    phantomjs.on('exit', function() { sleepyhollow.emit('exit'); });
    phantomjs.stderr.on('data', function(data) {
        data.toString().split('\n').forEach(read);
    });

    phantomjs.stdout.on('data', function(data) {
        var errorHandlers = sleepyhollow.listeners('error');
        if (errorHandlers && errorHandlers.length > 0)
            sleepyhollow.emit('error', data.toString());
    });

    // the writing mechanism, which drains periodically
    var writeBuffer = [];
    function write(obj) { writeBuffer.push(JSON.stringify(obj)); }
    function _write() {
        phantomjs.stdin.write(writeBuffer.join("\v") + "\n");
        writeBuffer = [];
    }

    // the read mechanism that selectively writes
    var messageBuffer = [];
    
    function read(data_) {
        if (!data_) return;
        try { data = JSON.parse(data_) }
        catch (e) { console.log(e, data); throw new Error(e); }

        //push data.message into a buffer
        messageBuffer.push(data.message);

        //emit the message if we have the whole thing -- otherwise skip the emission until later
        if(!data.isMultipart || data.isEof){
            _emit.apply(sleepyhollow, [data.event, messageBuffer.join('')]);
            messageBuffer = [];//flush the buffer
        }//else{ console.log('\n\n ***BUFFERING*** \n\n',data); }; //<== uncomment the else stmt for debugging

        if (data.event == "ack") return;
        write({ "event": "ack" });
        _write();
    }

    return sleepyhollow;
}

module.exports = sleepyhollow;