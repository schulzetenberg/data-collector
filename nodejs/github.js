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
        userData(githubConfig),
        contribData(githubConfig)
      ];

      Q.all(promises).then(function(data){
        var doc = new githubModel({
          repos: data[0].public_repos,
          contribSvg: data[1]
        });

        doc.save().catch(function(err) {
          logger.error(err);
        });
      }).then(function(){
        logger.info('Done with Github save');
      }).catch(function(err){
        logger.error('Caught github save error:', err);
      });
    } else {
      logger.error('Github config missing');
    }
  }).catch(function(err){
    logger.error('Github config error:', err);
  });
};

function userData(config){
  var defer = Q.defer();

  var options = {
    url: 'https://api.github.com/users/' + config.user + '?access_token=' + config.token,
    headers: { 'User-Agent': 'GitHub User:' + config.user }
  };

  request(options, function(error, response, body) {
    if (error || response.statusCode !== 200) {
      defer.reject(error);
    } else {
      try {
        body = JSON.parse(body);
        defer.resolve(body);
      } catch (e){
        defer.reject('Unable to parse github response body', e);
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
      defer.reject(error);
    } else {
      defer.resolve(body);
    }
  });

  return defer.promise;
}
