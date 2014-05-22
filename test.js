
var assert = require('assert')
  , sleepyhollow = require('./')
  , drjekyll = sleepyhollow(['node_modules/sleepyhollow-phantom/index.js'])
  ;

// the events we've seen, need to see
var events = [], needed = ["open", "exit", "ack" ];

// register event listeners
needed.forEach(function(need) {
    drjekyll.on(need, function() {
        events.push(need);
    });
});

// emit a hello which should trigger an ack
setInterval(function() {
    drjekyll.emit('hello');
}, 1e3);

// run tests when phantomjs finishes
drjekyll.on('exit', function() {
    needed.forEach(function(need) {
        var found = false;
        events.forEach(function(event) {
            if (need == event) found = true;
        });
        assert(found, need + " event was not fired");
    });
    process.exit();
});
