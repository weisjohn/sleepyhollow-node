
var assert = require('assert')
  , sleepyhollow = require('./')
  , drjekyll = sleepyhollow('node_modules/sleepyhollow-phantom/test.js')
  , fs = require('fs')
  ;

var outputStr = null, //Our test data.  Will be returned on our "output" event.
	inputStr = fs.readFileSync('./node_modules/sleepyhollow-node/testData_10k.html','utf8');//our control data

// the events we've seen, need to see
var events = [], needed = ["open", "render", "exit", "ack" ];

//additional event case
needed.push("output");//add to list of required events
drjekyll.on("output",function(str){
	// 	console.log(str); //uncomment for debugging
	outputStr = str;
	events.push("output");//add to list of received events
});


// register event listeners
needed.forEach(function(need) {
    drjekyll.on(need, function() {
        events.push(need);
    });
});


// tell mrhyde to open github.com
// setTimeout(function() { drjekyll.emit('page', "https://github.com/"); }, 1e3);
setTimeout(function() { drjekyll.emit('page', "./node_modules/sleepyhollow-node/testData_10k.html"); }, 1e3);
drjekyll.on('render', function() { drjekyll.emit("end"); });

// run tests when phantomjs finishes
drjekyll.on('exit', function() {
    var success = true;
    needed.forEach(function(need) {
        var found = false;
        events.forEach(function(event) {
            if (need == event) found = true;
        });
        console.log('testing event: '+need);
        assert(found, need + " event was not fired");
        if (!found) success = false;
    });
    console.log('comparing input and output');
    assert.equal(outputStr, inputStr, "Input and output strings are different. Should be identical.");
    console.log('TESTING COMPLETE.')
    process.exit(success ? 0 : 1);
});


