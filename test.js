
var assert = require('assert')
  , sleepyhollow = require('./')
  , drjekyll = sleepyhollow('node_modules/sleepyhollow-phantom/test.js')
  ;

// the events we've seen, need to see
var events = [], needed = ["open", "render", "exit", "ack" ];

// register event listeners
needed.forEach(function(need) {
    drjekyll.on(need, function() {
        events.push(need);
    });
});

// generate a large string of alphabetical characters
var len = 1e4, mod = 26, pad = 65;
var challenge = [];
for (var i = 0; i < len; i++) {
    var c = (i % mod) + pad;
    challenge += String.fromCharCode(c);
}

// add a special case, to check for the large string
needed.push("output");
drjekyll.on("output", function(response) {
    assert.equal(challenge, response, "buffered communication failure");
    events.push("output");
});

// tell mrhyde to open github.com
setTimeout(function() { drjekyll.emit('page', "https://github.com/"); }, 1e3);
drjekyll.on('render', function() { drjekyll.emit("end"); });

// run tests when phantomjs finishes
drjekyll.on('exit', function() {
    var success = true;
    needed.forEach(function(need) {
        var found = false;
        events.forEach(function(event) {
            if (need == event) found = true;
        });
        assert(found, need + " event was not fired");
        if (!found) success = false;
    });

    process.exit(success ? 0 : 1);
});
