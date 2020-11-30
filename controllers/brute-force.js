const moment = require('moment');
const ExpressBrute = require('express-brute');
const MongoStore = require('express-brute-mongo');
const { MongoClient } = require('mongodb');

const response = require('../nodejs/response');
const secrets = require('../config/secrets');
const logger = require('../nodejs/log');

const store = new MongoStore((ready) => {
  MongoClient.connect(secrets.MongoUrl, (err, client) => {
    if (err) throw err;

    const db = client.db(secrets.db, { authSource: 'admin' });

    ready(db.collection('bruteforce-store'));
  });
});

// eslint-disable-next-line no-new
new ExpressBrute(store);

const failCallback = (req, res, next, nextValidRequestDate) => {
  response.userError(res, `You've made too many failed login attempts, please try again ${moment(nextValidRequestDate).fromNow()}`);
};

const handleStoreError = (error) => {
  logger.error(error);

  // cause node to exit, hopefully restarting the process fixes the problem
  // eslint-disable-next-line no-throw-literal
  throw {
    message: error.message,
    parent: error.parent,
  };
};

// Start slowing requests after 5 failed attempts for the same user
exports.userBruteforce = new ExpressBrute(store, {
  freeRetries: 5,
  proxyDepth: 1,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour,
  failCallback,
  handleStoreError,
});

// No more than 1000 login attempts per day per IP
exports.globalBruteforce = new ExpressBrute(store, {
  freeRetries: 1000,
  proxyDepth: 1,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  maxWait: 25 * 60 * 60 * 1000, // 1 day 1 hour (should never reach this wait time)
  lifetime: 24 * 60 * 60, // 1 day (seconds not milliseconds)
  failCallback,
  handleStoreError,
});
