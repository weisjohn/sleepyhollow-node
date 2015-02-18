sleepyhollow-node
==========

Node.js binder for two-way communication with PhantomJS. An IPC library in two modules, used in conjunction with [sleepyhollow-phantom](https://github.com/weisjohn/sleepyhollow-phantom), via `stdin` and `stderr`. No `socket.io` or server-page hacks required. Sleepyhollow supports sending and receiving any [JSON serialzable data](http://www.json.org/) type.

### usage

To send and receive messages from Node.js to PhantomJS, require and invoke `sleepyhollow-node`. This returns an `EventEmitter` instance, which allows you to implement your own message passing system. It supports both event names as well as 

```
var sleepyhollow = require('sleepyhollow-node');
var drjekyll = sleepyhollow('phantom-code.js');

drjekyll.emit('render', "http://github.com/");
drjekyll.on('rendered', function() {
    console.log('a page was rendered');
    drjekyll.emit('end');
});
```

#### `emit(event, [param])`

Arguments:

1. event - String: name of the event
2. param - Mixed: optional, any `JSON.stringify()`-able value is supported

Returns: null

Example:

```javascript
drjekyll.emit("fetch", url);
```


#### `on(event, listener)`

Arguments:

1. event - String: name of the event
2. listener - Function(Mixed): receives a optional `JSON.stringify()`-able value

Example:

```javascript
drjekyll.on('payload', function(obj) {
    console.log(obj.prop);
})
```

[See the usage example for the corresponding PhantomJS code](https://github.com/weisjohn/sleepyhollow-phantom#usage).


### errors

The error support in PhantomJS isn't the best. `sleepyhollow` provides one custom event to listen for errors in your script:

```
var sleepyhollow = require('sleepyhollow-node');
var drjekyll = sleepyhollow('some-phantom-script.js');
drjekyll.on('error', function(data) {
    console.log(data);
});
```

Anything that comes across `stdout` will be passed over to the `error` event handler, so if you `console.log` from your PhantomJS code, it will be sent to that handler.


### options

To run PhantomJS with [advanced options](http://phantomjs.org/api/command-line.html), you can simply pass them when you invoke `sleepyhollow`. 

For example, to tell PhantomJS to ignore ssl errors:

```
var me = sleepyhollow('--ignore-ssl-errors=true', 'myscript.js');
```


### examples

See the [examples](examples) folder, these can be run with `node`.


### testing

```
$ npm test
```
