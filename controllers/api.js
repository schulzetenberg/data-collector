var moment = require('moment');

var lastFM = require('../models/last-fm-schema');
var goodreads = require('../models/goodreads-schema');
var github = require('../models/github-schema');
var trakt = require('../models/trakt-schema');
var states = require('../nodejs/states');
var fuelly = require('../models/fuelly-schema');

exports.getLastFM = function(req, res, next) {
  lastFM.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, data) {
    if (err) return next(err);
    res.json(data);
  });
};

exports.getGoodreads = function(req, res, next) {
  goodreads.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, data) {
    if (err) return next(err);
    res.json(data);
  });
};

exports.getGithub = function(req, res, next) {
  github.findOne({}, {}, { sort: { '_id' : -1 } }, function(err, data) {
    if (err) return next(err);
    res.json(data);
  });
};

exports.getTrakt = function(req, res, next) {
  trakt.findOne({}, {}, { sort: { '_id' : -1 } }).lean().exec(function (err, data){
    if (err) return next(err);
    if(!data) return next("No data");

    var startDate = moment('2016-10-02');
    var now = moment();
    var totalDays = now.diff(startDate, 'days');
    data.totalDays = totalDays;

    res.json(data);
  });
};

exports.getStates = function(req, res) {
  states.get().then(function(data){
    res.json(data);
  }).catch(function(err){
    console.log("Get states error", err);
    res.sendStatus(500);
  });
};

exports.getFuelly = function(req, res, next) {
  // Get all data from the current year
  var year = moment().year();
  var start = moment('01/01/' + year, 'MM-DD-YYYY');
  var end = moment('01/01/' + (year + 1), 'MM-DD-YYYY');

  fuelly.find({"fillTime" : {"$gte": start, "$lte": end}}, {}, { sort: { '_id' : -1 } }).lean().exec(function (err, data){
    if (err) return next(err);
    res.json(data);
  });
};
