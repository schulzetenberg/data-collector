var request = require('request');
var Q = require('q');

var logger = require('./log');
var githubSchema = require('../models/github-schema.js');
var appConfig = require('./app-config');

exports.save = function() {
  logger.info("Starting Github");

  appConfig.get().then(function(config){
    if(config && config.github && config.github.user && config.github.token){
      var promises = [userData(config.github),contribData(config.github)];
      Q.all(promises).then(function(data){
        var doc = new githubSchema({
          repos: data[0].public_repos,
          contribSvg: data[1]
        });

        doc.save(function(err) {
          if (err) logger.error(err);
        });
      }).catch(function(err){
        logger.error("Caught github save error:", err);
      });
    } else {
      logger.error("Github config missing");
    }
  }).catch(function(err){
    logger.error("Github config error:", err);
  });

  function userData(config){
    var defer = Q.defer();

    var options = {
      url: "https://api.github.com/users/" + config.user + "?access_token=" + config.token,
      headers: { 'User-Agent': 'GitHub User:' + config.user }
    };

    request(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        defer.reject(error);
      } else {
        try {
          body = JSON.parse(body);
          defer.resolve(body);
        } catch (e){
          defer.reject("unable to parse github response body", e);
        }
      }
    });

    return defer.promise;
  }

  function contribData(config){
    var defer = Q.defer();
    var optionsContrib = { url: "https://github.com/users/" + config.user + "/contributions" };

    request(optionsContrib, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        defer.reject(error);
      } else {
        defer.resolve(body);
      }
    });

    return defer.promise;
  }

};
