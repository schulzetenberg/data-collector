var logger = require('./log');
var request = require('request');
var Q = require('q');

var appConfig = require('./app-config');
var traktModel = require('../models/trakt-model.js');

exports.save = function() {
  logger.info("Starting Trakt");

  var traktConfig = {};
  var statsData;
  var moviesData;

  appConfig.get().then(function(config){
    traktConfig = config && config.trakt;
    if(!traktConfig) return logger.error("Missing trakt config");
    return userData(traktConfig);
  }).then(function(data) {
    statsData = data;
    return topRatings(traktConfig, 'movies');
  }).then(function(data){
    moviesData = data;
    return topRatings(traktConfig, 'shows');
  }).then(function(showsData){
    var doc = new traktModel({
      stats: statsData,
      topMovies: moviesData,
      topShows: showsData
    });

    doc.save(function(err) {
      if (err) logger.error(err);
    });
  }).catch(function(err){
    logger.error("Caught trakt save error:", err);
  });
};

function userData(config){
  var defer = Q.defer();

  if(!config.user || !config.id){
    defer.reject("Missing config");
  } else {
    var options = {
      url: 'https://api.trakt.tv/users/' + config.user + '/stats',
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': config.id
      }
    };

    request(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        defer.reject(error);
      } else {
        try {
          body = JSON.parse(body);
          defer.resolve(body);
        } catch (err){
          defer.reject("unable to parse trakt user stats response body", err);
        }
      }
    });
  }

  return defer.promise;
}

// Type:  movies , shows , seasons , episodes , all
function topRatings(config, type){
  var defer = Q.defer();

  if(!config.user || !config.id){
    defer.reject("Missing config");
  } else {
    var options = {
      url: 'https://api.trakt.tv/users/' + config.user + '/ratings/' + type + '/,9,10', // Only items rated 9 or 10
      headers: {
        'Content-Type': 'application/json',
        'trakt-api-version': '2',
        'trakt-api-key': config.id
      }
    };

    request(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        defer.reject(error);
      } else {
        try {
          body = JSON.parse(body);
          defer.resolve(body);
        } catch (e){
          defer.reject("unable to parse trakt ratings response body", e);
        }
      }
    });
  }

  return defer.promise;
}
