var locomotive = require('locomotive');
var app = new locomotive.Application();
var bootable = require('bootable');
var bootableEnvironment = require('bootable-environment');
var socketio = require('socket.io');
var http = require('http');
var colors = require('colors');

// Controllers.
app.phase(locomotive.boot.controllers(__dirname + '/app/controllers'));
// Views.
app.phase(locomotive.boot.views());
// Environments.
app.phase(bootableEnvironment(__dirname + '/config/environments'));
// Initializers.
app.phase(bootable.initializers(__dirname + '/config/initializers'));
// Routes.
app.phase(locomotive.boot.routes(__dirname + '/config/routes'));

// HTTP server.
app.phase(function () {
	console.log('Starting HTTP server.');

	this.httpServer = http.createServer(this.express).listen(3000);

	console.log('HTTP server listening on ' + this.httpServer.address().address + ':' + this.httpServer.address().port);
	console.log('Started HTTP server.'.green);
});

// socket.io
app.phase(function () {
	console.log('Starting socket.io.');

	this.io = socketio.listen(this.httpServer);
	this.io.set('log level', 1);

	console.log('Started socket.io.'.green);
});

// Boot the application.
app.boot(function(err) {
	if (err) {
		console.error(err.message);
		console.error(err.stack);
		return process.exit(-1);
	}
	console.log('App started!'.green);
	console.log('Current beta testers:'.cyan);
	console.log(app.nconf.get('betaTesters').split(',').sort());
});
