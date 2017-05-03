var winston = require('winston');

var logLevel = process.env.LOG_LEVEL || 'debug';
winston.level = logLevel;
winston.info('Log level:' + logLevel);

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      timestamp: true,
      colorize: true
    }),
    new (winston.transports.File)({
      filename: 'logs/main.log',
      timestamp: true,
      prepend: true,
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    })
  ]
});

module.exports = logger;
