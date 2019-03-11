const fs = require('fs');
const http = require('http');
const https = require('https');

const logger = require('./log');
const app = require('../app');
const secrets = require('../config/secrets');

const ipAddress = secrets.ipAddress;
const port = secrets.port;
var server;

// Create HTTP(S) server.
if (!secrets.SSL) {
  server = http.createServer(app);
} else {
  const privateKey  = fs.readFileSync('./key.pem', 'utf8');
  const certificate = fs.readFileSync('./cert.pem', 'utf8');
  const credentials = {key: privateKey, cert: certificate};

  server = https.createServer(credentials, app);
}

// Listen on provided port
server.listen(port, ipAddress, function () {
  logger.warn('%s: Node server started on %s:%d ...', Date(Date.now()), ipAddress, port);
});

server.on('error', onError);

// Event listener for HTTP server 'error' event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      logger.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      logger.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
