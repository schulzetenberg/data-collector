const mongoose = require('mongoose');
const Q = require('q');

mongoose.Promise = Q.Promise;
const secrets = require('../config/secrets');
const logger = require('./log');

// q promise library
mongoose.Promise = require('q').Promise;

const url = secrets.db;
mongoose.connect(url);
const db = mongoose.connection;

// When successfully connected
db.on('connected', () => {
  logger.warn(`Mongoose connection open to ${url}`);
});

// If the connection throws an error
db.on('error', (err) => {
  logger.error(`Mongoose connection error: ${err}`);
});

// When the connection is disconnected
db.on('disconnected', () => {
  logger.error('Mongoose disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  db.close(() => {
    logger.error('Mongoose connection disconnected through app termination');
    process.exit(0);
  });
});
