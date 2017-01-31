/**
 * Brute force attack prevention
 */
var secrets = require('../config/secrets');
var moment = require('moment');
var ExpressBrute = require('express-brute');
var MongoStore = require('express-brute-mongo');
var MongoClient = require('mongodb').MongoClient;
var store = new MongoStore(function (ready) {
  MongoClient.connect(secrets.db, function(err, db) {
    if (err) throw err;
    ready(db.collection('bruteforce-store'));
  });
});
var bruteforce = new ExpressBrute(store);

var failCallback = function (req, res, next, nextValidRequestDate) {
    req.flash('error', {msg: "You've made too many failed attempts, please try again "+moment(nextValidRequestDate).fromNow()});
    res.redirect('/login'); // brute force protection triggered, send them back to the login page
};

var handleStoreError = function (error) {
    console.log(error); // log this error so we can figure out what went wrong
    // cause node to exit, hopefully restarting the process fixes the problem
    throw {
        message: error.message,
        parent: error.parent
    };
};

// Start slowing requests after 5 failed attempts to do something for the same user
exports.userBruteforce =  new ExpressBrute(store, {
    freeRetries: 5,
    proxyDepth: 1,
    minWait: 5*60*1000, // 5 minutes
    maxWait: 60*60*1000, // 1 hour,
    failCallback: failCallback,
    handleStoreError: handleStoreError
});

// No more than 1000 login attempts per day per IP
exports.globalBruteforce = new ExpressBrute(store, {
    freeRetries: 1000,
    proxyDepth: 1,
    attachResetToRequest: false,
    refreshTimeoutOnRequest: false,
    minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
    maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
    lifetime: 24*60*60, // 1 day (seconds not milliseconds)
    failCallback: failCallback,
    handleStoreError: handleStoreError
});
