const logger = require('./log');

const appConfig = require('./app-config');
const traktModel = require('../models/trakt-model.js');
const api = require('./api');

exports.save = function(userId) {
  logger.info('Starting Trakt');

  let traktConfig = {};
  let statsData;
  let moviesData;

  appConfig
    .get(userId)
    .then(function(config) {
      traktConfig = config && config.trakt;
      if (!traktConfig) return logger.error('Missing trakt config');
      return userData(traktConfig);
    })
    .then(function(data) {
      statsData = data;
      return topRatings(traktConfig, 'movies');
    })
    .then(function(data) {
      moviesData = data;
      return topRatings(traktConfig, 'shows');
    })
    .then(function(showsData) {
      let doc = new traktModel({
        userId,
        stats: statsData,
        topMovies: moviesData,
        topShows: showsData,
      });

      return doc.save();
    })
    .then(function() {
      logger.info('Finished saving trakt data');
    })
    .catch(function(err) {
      logger.error('Caught trakt save error:', err);
    });
};

function userData(config) {
  if (!config.user || !config.id) {
    return Promise.reject('Missing config');
  }

  const options = {
    url: 'https://api.trakt.tv/users/' + config.user + '/stats',
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': config.id,
    },
  };

  return api.get(options);
}

// Type:  movies , shows , seasons , episodes , all
function topRatings(config, type) {
  if (!config.user || !config.id) {
    return Promise.reject('Missing config');
  }

  const options = {
    url: 'https://api.trakt.tv/users/' + config.user + '/ratings/' + type + '/,9,10', // Only items rated 9 or 10
    headers: {
      'Content-Type': 'application/json',
      'trakt-api-version': '2',
      'trakt-api-key': config.id,
    },
  };

  return api.get(options);
}
