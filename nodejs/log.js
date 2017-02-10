var logger = require('winston');

var logLevel = process.env.LOG_LEVEL || 'debug';
logger.level = logLevel;
logger.info('Log level:' + logLevel);

module.exports = logger;
