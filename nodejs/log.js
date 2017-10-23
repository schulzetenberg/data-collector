const winston = require('winston');

const logLevel = process.env.LOG_LEVEL || 'debug';
winston.level = logLevel;
winston.info('Log level:' + logLevel);

const logger = new (winston.Logger)({
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
