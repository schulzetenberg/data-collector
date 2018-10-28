const moment = require('moment');

const music = require('../models/music-model');
const goodreads = require('../models/goodreads-model');
const github = require('../models/github-model');
const trakt = require('../models/trakt-model');
const states = require('../nodejs/states');
const fuelly = require('../models/fuelly-model');
const playerFm = require('../models/player-fm-model');

exports.getMusic = function(req, res, next) {
  music
    .findOne(
      {},
      {},
      {
        sort: {
          _id: -1,
        },
      }
    )
    .lean()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

exports.getGoodreads = function(req, res, next) {
  if (!req.query.start || !req.query.end) return next('Start and end time parameters required');

  const by = {
    dateRead: {
      $gte: req.query.start,
      $lte: req.query.end,
    },
  };

  goodreads
    .findOne(
      by,
      {},
      {
        sort: {
          _id: -1,
        },
      }
    )
    .lean()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

exports.getPlayerFm = function(req, res, next) {
  playerFm
    .findOne(
      {},
      {},
      {
        sort: {
          _id: -1,
        },
      }
    )
    .lean()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

exports.getGithub = function(req, res, next) {
  github
    .findOne(
      {},
      {},
      {
        sort: {
          _id: -1,
        },
      }
    )
    .lean()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

exports.getTrakt = function(req, res, next) {
  trakt
    .findOne(
      {},
      {},
      {
        sort: {
          _id: -1,
        },
      }
    )
    .lean()
    .then(function(data) {
      if (!data) return next('No data');

      const startDate = moment('2016-10-02');
      const now = moment();
      const totalDays = now.diff(startDate, 'days');
      data.totalDays = totalDays;

      res.json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

exports.getStates = function(req, res) {
  states
    .get()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      console.log('Get states error', err);
      res.sendStatus(500);
    });
};

exports.getFuelly = function(req, res, next) {
  if (!req.query.start || !req.query.end) return next('Start and end time parameters required');
  if (!req.query.name) return next('Vehicle name required');

  const by = {
    name: req.query.name,
    fillTime: {
      $gte: req.query.start,
      $lte: req.query.end,
    },
  };

  fuelly
    .find(
      by,
      {},
      {
        sort: {
          _id: -1,
        },
      }
    )
    .lean()
    .then(function(data) {
      res.json(data);
    })
    .catch(function(err) {
      return next(err);
    });
};

exports.getFuellyAvg = function(req, res, next) {
  // Get all data from the past year
  const numDays = 365;
  const start = moment()
    .subtract(numDays, 'days')
    .toDate();
  const end = moment().toDate();
  const filter = {
    fillTime: {
      $gte: start,
      $lte: end,
    },
  };

  fuelly
    .find(
      filter,
      {},
      {
        sort: {
          _id: -1,
        },
      }
    )
    .lean()
    .then(function(data) {
      const retData = {
        totalGallons: 0,
        totalMiles: 0,
        totalPrice: 0,
      };

      for (let i = 0, x = data.length; i < x; i++) {
        retData.totalGallons += data[i].gallons;
        retData.totalMiles += data[i].miles;
        retData.totalPrice += data[i].price * data[i].gallons;
      }

      retData.daysPerBarrel = parseInt(1 / (retData.totalGallons / 42 / numDays));
      retData.avgDriving = parseInt(retData.totalMiles / numDays);
      retData.totalPrice = retData.totalPrice.toFixed(2);
      res.json(retData);
    })
    .catch(function(err) {
      return next(err);
    });
};
