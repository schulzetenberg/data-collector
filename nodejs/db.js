const mongoose = require('mongoose');

const secrets = require('../config/secrets');
const logger = require('./log');

const url = `${secrets.MongoUrl + secrets.db}?authSource=admin`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
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
