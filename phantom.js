
var stderr = require('system').stderr;
var stdin = require('system').stdin;

function write(obj) {
    stderr.write(JSON.stringify(obj) + "\n");
    if (obj.event !== "ack") read();
}

function read() {
    var data = stdin.readLine();
    try { data.split("\v").forEach(_read) } 
    catch (e) { throw new Error(data); }
}

function _read(data) { return _readLine(JSON.parse(data)); }
function _readLine(obj) {
    if (obj.event !== "ack") write({ event: "ack", message: obj });
    // TODO: invoke routes here
    // if (obj.event)
}

setInterval(function() {
    write({ "event" : "heartbeat" });
}, 1e2);

var page = require('webpage').create();
page.open("http://github.com", function(status) {
    if (status == "success") {
        write({ "event": "open" });
        page.render('github.jpg');
        write({ "event": "render" });
    }
    phantom.exit();
});
