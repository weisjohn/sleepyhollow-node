sleepyhollow-node
==========

Node.js binder for two-way communication with PhantomJS. An IPC library in two modules, An IPC library in two modules, used in conjunction with [sleepyhollow-phantom](https://github.com/weisjohn/sleepyhollow-phantom), via `stdin` and `stdout`. No `socket.io` or server-page hacks required.

### usage

To send and receive messages from Node.js to PhantomJS, require and invoke `sleepyhollow-node`. This returns an `EventEmitter` instance, which allows you to implement your own message passing system.

```
var sleepyhollow = require('sleepyhollow-node');
var drjekyll = sleepyhollow('some-phantom-script.js');

drjekyll.emit('render', "http://github.com/");
drjekyll.on('rendered', function() {
    console.log('a page was rendered');
});

drjekyll.emit('end');
```

[The corresponding PhantomJS code](https://github.com/weisjohn/sleepyhollow-phantom).


### options

To run PhantomJS with [advanced options](http://phantomjs.org/api/command-line.html), you can simply pass them when you invoke `sleepyhollow`. 

For example, to tell PhantomJS to ignore ssl errors:

```
var me = sleepyhollow('myscript.js', '--ignore-ssl-errors=true');
```


### examples

See the [examples] folder, these can be run with `node`.