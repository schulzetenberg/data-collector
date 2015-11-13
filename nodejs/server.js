#!/bin/env node
// Initial file from: https://github.com/master-atul/openshift-express4/blob/master/server.js

var AppContainer = function () {
  //  Scope.
  var self = this;

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function () {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
    self.port = process.env.OPENSHIFT_NODEJS_PORT || 8999;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    }
  };

  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function (sig) {
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating the app ...',
        Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()));
  };

  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function () {
    //  Process on exit and signals.
    process.on('exit', function () {
      self.terminator();
    });

    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function (element, index, array) {
        process.on(element, function () {
          self.terminator(element);
        });
      });
  };

  
   //Initializes the application.
  self.initialize = function () {
    self.setupVariables();
    self.setupTerminationHandlers();
  };

  
  self.setupServer = function () {

    /**
     * Module dependencies.
     */
	var app = require('../app');
    var http = require('http');
    var https = require('https');
    /**
     * Credentials for local HTTPS
     */
    //var privateKey  = fs.readFileSync('../key.pem', 'utf8');
    //var certificate = fs.readFileSync('../cert.pem', 'utf8');
    //var credentials = {key: privateKey, cert: certificate};
    
    /**
     * Get port from environment and store in Express.
     */
    var port = normalizePort(self.port);
    /**
     * Create HTTP(S) server.
     */
    var server = http.createServer(app);
	//var secureServer = https.createServer(app);
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(self.port, self.ipaddress, function () {
      console.log('%s: Node server started on %s:%d ...',
        Date(Date.now()), self.ipaddress, self.port);
    });
    //secureServer.listen(8443);
    server.on('error', onError);
    server.on('listening', onListening);

    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
      var port = parseInt(val, 10);

      if (isNaN(port)) {
        // named pipe
        return val;
      }

      if (port >= 0) {
        // port number
        return port;
      }

      return false;
    }

    /**
     * Event listener for HTTP server "error" event.
     */
    function onError(error) {
      if (error.syscall !== 'listen') {
        throw error;
      }

      var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

      // handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(bind + ' requires elevated privileges');
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(bind + ' is already in use');
          process.exit(1);
          break;
        default:
          throw error;
      }
    }

    /**
     * Event listener for HTTP server "listening" event.
     */
    function onListening() {
      var addr = server.address();
      console.log('Server on port : ' + addr.port);
    }
  };
};

var zapp = new AppContainer();
zapp.initialize();
zapp.setupServer();