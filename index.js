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
    var readBuffer = [];
    function read(data) {

        // parse the message to ensure phantom sent correctly
        if (!data) return;
        try { data = JSON.parse(data) }
        catch (e) { console.log(e, data); throw new Error(e); }

        // if the message has already been converted into a full object,
        // re-stringify it to be parsed later
        if (typeof data.message == "object") {
            data.message = JSON.stringify(data.message);
        }

        // if there's a message, push onto the readBuffer
        if (data.message) readBuffer.push(data.message);

        // emit if this data is not multipart or it's the last message
        if (!data.isMultipart || data.isEOF) {

            // build up the args to emit
            var args = [data.event];

            // join up the buffer, silently fail if not an object
            var message = readBuffer.join('');
            if (message && typeof message !== "object") {
                try { message = JSON.parse(message); }
                catch (e) { console.log(e, message); throw new Error(e); }
                args.push(message);
            }

            // emit the event with variable arguments
            _emit.apply(sleepyhollow, args);

            // reset the buffer
            readBuffer = [];
        }

        if (data.event == "ack") return;
        write({ "event": "ack" });
        _write();
    }

    return sleepyhollow;
}

module.exports = sleepyhollow;