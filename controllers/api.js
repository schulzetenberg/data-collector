const moment = require('moment');

const music = require('../models/music-model');
const goodreads = require('../models/goodreads-model');
const github = require('../models/github-model');
const trakt = require('../models/trakt-model');
const states = require('../nodejs/states');
const countries = require('../nodejs/countries');
const fuelly = require('../models/fuelly-model');
const playerFm = require('../models/player-fm-model');
const instagram = require('../models/instagram-model');
const response = require('../nodejs/response');
const logger = require('../nodejs/log');

exports.getMusic = (req, res) => {
  music
    .findOne(
      // eslint-disable-next-line no-underscore-dangle
      { userId: req.userId },
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
      logger.error('Error getting music data', err);
      response.serverError(res, 'Error getting music data');
    });
};

exports.getGoodreads = (req, res) => {
  goodreads
    .findOne(
      // eslint-disable-next-line no-underscore-dangle
      { userId: req.userId },
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
      logger.error('Error getting Goodreads data', err);
      response.serverError(res, 'Error getting Goodreads data');
    });
};

exports.getPlayerFm = (req, res) => {
  playerFm
    .findOne(
      // eslint-disable-next-line no-underscore-dangle
      { userId: req.userId },
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
      logger.error('Error getting PlayerFM data', err);
      response.serverError(res, 'Error getting PlayerFM data');
    });
};

exports.getGithub = (req, res) => {
  github
    .findOne(
      // eslint-disable-next-line no-underscore-dangle
      { userId: req.userId },
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
      logger.error('Error getting Github data', err);
      response.serverError(res, 'Error getting Github data');
    });
};

exports.getTrakt = (req, res) => {
  trakt
    .findOne(
      // eslint-disable-next-line no-underscore-dangle
      { userId: req.userId },
      {},
      {
        sort: {
          _id: -1,
        },
      }
    )
    .lean()
    .then((data) => {
      if (!data) return response.serverError(res, 'No data');

      const startDate = moment('2016-10-02');
      const now = moment();
      const totalDays = now.diff(startDate, 'days');
      // eslint-disable-next-line no-param-reassign
      data.totalDays = totalDays;

      res.json(data);
    })
    .catch((err) => {
      logger.error('Error getting Trakt data', err);
      response.serverError(res, 'Error getting Trakt data');
    });
};

exports.getStates = (req, res) => {
  states
    // eslint-disable-next-line no-underscore-dangle
    .get(req.userId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      logger.error('Get states error', err);
      response.serverError(res, 'Error getting states data');
    });
};

exports.getCountries = (req, res) => {
  countries
    // eslint-disable-next-line no-underscore-dangle
    .get(req.userId)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      logger.error('Get countries error', err);
      response.serverError(res, 'Error getting countries data');
    });
};

exports.getFuelly = (req, res) => {
  if (!req.query.start || !req.query.end) return response.userError(res, 'Start and end time parameters required');
  if (!req.query.name) return response.userError(res, 'Vehicle name required');

  const by = {
    // eslint-disable-next-line no-underscore-dangle
    userId: req.userId,
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
      logger.error('Get Fuelly error', err);
      response.serverError(res, 'Error getting Fuelly data');
    });
};

exports.getFuellyAvg = (req, res) => {
  // Get all data from the past year
  const numDays = 365;
  const start = moment()
    .subtract(numDays, 'days')
    .toDate();
  const end = moment().toDate();

  const filter = {
    // eslint-disable-next-line no-underscore-dangle
    userId: req.userId,
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
      logger.error('Get Fuelly averages error', err);
      response.serverError(res, 'Error getting Fuelly averages data');
    });
};

exports.getInstagram = (req, res) => {
  instagram
    .findOne({ userId: req.userId }, {}, { sort: { _id: -1 } })
    .lean()
    .then((data) => res.json(data))
    .catch((err) => {
      logger.error('Error getting Instagram data', err);
      response.serverError(res, 'Error getting Instagram data');
    });
};
