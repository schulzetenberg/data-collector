const request = require('request');
const Q = require('q');

const logger = require('./log');
const githubModel = require('../models/github-model.js');
const appConfig = require('./app-config');

exports.save = function() {
  logger.info('Starting Github');

  appConfig.app('github').then(function(githubConfig) {
    if(githubConfig && githubConfig.user && githubConfig.token) {
      var promises = [
        contribData(githubConfig),
        apiCall({ config: githubConfig, url: '/users/' + githubConfig.user }), // User data
        apiCall({ config: githubConfig, url: '/users/' + githubConfig.user + '/followers' }), // Followers data
        apiCall({ config: githubConfig, url: '/users/' + githubConfig.user + '/following' }), // Following data
      ];

      Q.all(promises).then(function(data){
        var doc = new githubModel({
          contribSvg: data[0],
          repos: data[1].public_repos,
          followers: data[2],
          following: data[3]
        });

        doc.save().catch(function(err) {
          logger.error(err);
        });
      }).then(function(){
        logger.info('Done with Github save');
      }).catch(function(err){
        logger.error('Github error:', err);
      });
    } else {
      logger.error('Github config missing');
    }
  }).catch(function(err){
    logger.error('Github config error:', err);
  });
};

function apiCall(params) {
  var defer = Q.defer();

  var options = {
    url: 'https://api.github.com' + params.url + '?access_token=' + params.config.token +'&per_page=100',
    headers: { 'User-Agent': 'GitHub User:' + params.config.user }
  };

  request(options, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.warn('Error for API call ' + params.url + '. Status code: ' + response.statusCode);
      defer.reject(error);
    } else {
      try {
        body = JSON.parse(body);
        defer.resolve(body);
      } catch(err) {
        logger.error(err);
        defer.reject('Unable to parse Github response body for API call ' + params.url);
      }
    }
  });

  return defer.promise;
}

function contribData(config){
  var defer = Q.defer();
  var optionsContrib = { url: 'https://github.com/users/' + config.user + '/contributions' };

  request(optionsContrib, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      logger.warn("Error. Status code: " + response.statusCode);
      defer.reject(error);
    } else {
      defer.resolve(body);
    }
  });

  return defer.promise;
}
