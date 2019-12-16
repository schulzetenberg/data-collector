const moment = require('moment');

const music = require('../models/music-model');
const goodreads = require('../models/goodreads-model');
const github = require('../models/github-model');
const trakt = require('../models/trakt-model');
const states = require('../nodejs/states');
const countries = require('../nodejs/countries');
const fuelly = require('../models/fuelly-model');
const playerFm = require('../models/player-fm-model');

exports.getMusic = (req, res, next) => {
  music
    .findOne(
      {},
      {},
      {
        sort: { _id: -1 },
      }
    )
    .lean()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getGoodreads = (req, res, next) => {
  goodreads
    .findOne(
      {},
      {},
      {
        sort: { _id: -1 },
      }
    )
    .lean()
    .then((data) => {
      console.log('data!', data);
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getPlayerFm = (req, res, next) => {
  playerFm
    .findOne(
      {},
      {},
      {
        sort: { _id: -1 },
      }
    )
    .lean()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getGithub = (req, res, next) => {
  github
    .findOne(
      {},
      {},
      {
        sort: { _id: -1 },
      }
    )
    .lean()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getTrakt = (req, res, next) => {
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
    .then((data) => {
      if (!data) return next('No data');

      const startDate = moment('2016-10-02');
      const now = moment();
      const totalDays = now.diff(startDate, 'days');
      // eslint-disable-next-line no-param-reassign
      data.totalDays = totalDays;

      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getStates = (req, res) => {
  states
    .get()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log('Get states error', err);
      res.sendStatus(500);
    });
};

exports.getCountries = (req, res) => {
  countries
    .get()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log('Get countries error', err);
      res.sendStatus(500);
    });
};

exports.getFuelly = (req, res, next) => {
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
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getFuellyAvg = (req, res, next) => {
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
    .then((data) => {
      const retData = {
        totalGallons: 0,
        totalMiles: 0,
        totalPrice: 0,
      };

      for (let i = 0, x = data.length; i < x; i += 1) {
        retData.totalGallons += data[i].gallons;
        retData.totalMiles += data[i].miles;
        retData.totalPrice += data[i].price * data[i].gallons;
      }

      retData.daysPerBarrel = parseInt(1 / (retData.totalGallons / 42 / numDays), 10);
      retData.avgDriving = parseInt(retData.totalMiles / numDays, 10);
      retData.totalPrice = retData.totalPrice.toFixed(2);
      res.json(retData);
    })
    .catch((err) => {
      return next(err);
    });
};
