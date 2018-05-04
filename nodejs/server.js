const fs = require('fs');
const http = require('http');
const https = require('https');

const logger = require('./log');
const app = require('../app');

const ipaddress = process.env.IP_ADDRESS || '127.0.0.1';
const port = process.env.PORT || 8998;
var server;

// Create HTTP(S) server.
if (!process.env.SSL) {
  server = http.createServer(app);
} else {
  const privateKey  = fs.readFileSync('./key.pem', 'utf8');
  const certificate = fs.readFileSync('./cert.pem', 'utf8');
  const credentials = {key: privateKey, cert: certificate};

  server = https.createServer(credentials, app);
}

// Listen on provided port
server.listen(port, ipaddress, function () {
  logger.warn('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddress, port);
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
