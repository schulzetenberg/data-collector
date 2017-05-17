var moment = require('moment');

var lastFM = require('../models/last-fm-model');
var goodreads = require('../models/goodreads-model');
var github = require('../models/github-model');
var trakt = require('../models/trakt-model');
var states = require('../nodejs/states');
var fuelly = require('../models/fuelly-model');

exports.getLastFM = function(req, res, next) {
  lastFM.findOne({}, {}, { sort: { '_id' : -1 } }).lean().exec().then(function(data){
    res.json(data);
  }).catch(function(err){
    return next(err);
  });
};

exports.getGoodreads = function(req, res, next) {
  goodreads.findOne({}, {}, { sort: { '_id' : -1 } }).lean().exec().then(function(data){
    res.json(data);
  }).catch(function(err){
    return next(err);
  });
};

exports.getGithub = function(req, res, next) {
  github.findOne({}, {}, { sort: { '_id' : -1 } }).lean().exec().then(function(data){
    res.json(data);
  }).catch(function(err){
    return next(err);
  });
};

exports.getTrakt = function(req, res, next) {
  trakt.findOne({}, {}, { sort: { '_id' : -1 } }).lean().exec().then(function(data){
    if(!data) return next("No data");

    var startDate = moment('2016-10-02');
    var now = moment();
    var totalDays = now.diff(startDate, 'days');
    data.totalDays = totalDays;

    res.json(data);
  }).catch(function(err){
    return next(err);
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
  if(!req.query.start || !req.query.end) return next('Start and end time parameters required');
  if(!req.query.name) return next('Vehicle name required');

  var by = {
    "name": req.query.name,
    "fillTime" : { "$gte": req.query.start, "$lte": req.query.end }
  };

  fuelly.find(by, {}, { sort: { '_id' : -1 } }).lean().exec().then(function(data){
    res.json(data);
  }).catch(function(err){
    return next(err);
  });
};

exports.getFuellyAvg = function(req, res, next) {
  // Get all data from the current year
  var year = moment().year();
  var start = moment('01/01/' + year, 'MM-DD-YYYY');
  var end = moment('01/01/' + (year + 1), 'MM-DD-YYYY');

  var by = {
    "fillTime" : { "$gte": start, "$lte": end }
  };

  fuelly.find(by, {}, { sort: { '_id' : -1 } }).lean().exec().then(function(data){
    var retData = {
      totalGallons: 0,
      totalMiles: 0,
      totalPrice: 0,
      totalDays: moment().diff('01/01/' + year, 'days')
    };

    for(var i=0, x=data.length; i<x; i++){
      retData.totalGallons += data[i].gallons;
      retData.totalMiles += data[i].miles;
      retData.totalPrice += (data[i].price * data[i].gallons);
    }

    retData.daysPerBarrel = parseInt(1 / ( (retData.totalGallons / 42) / retData.totalDays ));
    retData.totalPrice = retData.totalPrice.toFixed(2);
    res.json(retData);
  }).catch(function(err){
    return next(err);
  });
};
