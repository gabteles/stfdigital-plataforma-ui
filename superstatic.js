'use strict';

var superstatic = require('superstatic');
var connect = require('connect');
var https = require('https');
var fs = require('fs');

function parseArgument(name) {
    var argName = "--" + name;
    if (process.argv.indexOf(argName) != -1) {
        return process.argv[process.argv.indexOf(argName) + 1];
    } else {
        throw "Argument " + name + " not found.";
    }
}

var port = parseInt(parseArgument('port'));
var host = parseArgument('host');
var keyFile = parseArgument('keyFile');
var certFile = parseArgument('certFile');
var configFile = parseArgument('config');

var spec = {
  config: configFile,
  cwd: process.cwd()
};

var httpsOptions = {
  key: fs.readFileSync(keyFile),
  cert: fs.readFileSync(certFile)
};

var app = connect().use(superstatic(spec));

https.createServer(httpsOptions, app).listen(port, host, function(err) {
  if (err) { console.log(err); }
  console.log('Superstatic now serving on port ' + port + '...');
});