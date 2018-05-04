const logger = require('./log');
const Q = require('q');

const appConfig = require('./app-config');
const traktModel = require('../models/trakt-model.js');
const api = require('./api');

exports.save = function() {
  logger.info('Starting Trakt');

  var traktConfig = {};
  var statsData;
  var moviesData;

  appConfig.get().then(function(config){
    traktConfig = config && config.trakt;
    if(!traktConfig) return logger.error('Missing trakt config');
    return userData(traktConfig);
  }).then(function(data) {
    statsData = data;
    return topRatings(traktConfig, 'movies');
  }).then(function(data){
    moviesData = data;
    return topRatings(traktConfig, 'shows');
  }).then(function(showsData){
    let doc = new traktModel({
      stats: statsData,
      topMovies: moviesData,
      topShows: showsData
    });

    return doc.save();
  }).then(function(){
    logger.info('Finished saving trakt data');
  }).catch(function(err){
    logger.error('Caught trakt save error:', err);
  });
};

function userData(config){
  const defer = Q.defer();

  if(!config.user || !config.id){
    defer.reject('Missing config');
  } else {
    const options = {
      url: 'https://api.trakt.tv/users/' + config.user + '/stats',
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': config.id
      }
    };

    api.get(options).then(function(body){
      defer.resolve(body);
    }).catch(function(err){
        defer.reject(err);
    });
  }

  return defer.promise;
}

// Type:  movies , shows , seasons , episodes , all
function topRatings(config, type){
  const defer = Q.defer();

  if(!config.user || !config.id){
    defer.reject('Missing config');
  } else {
    const options = {
      url: 'https://api.trakt.tv/users/' + config.user + '/ratings/' + type + '/,9,10', // Only items rated 9 or 10
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': config.id
      }
    };

    api.get(options).then(function(body){
      defer.resolve(body);
    }).catch(function(err){
      defer.reject(err);
    })
  }

  return defer.promise;
}
