/*
  Using TMDB to get the best images:
  https://apiblog.trakt.tv/how-to-find-the-best-images-516045bcc3b6#.gjylr224j
 */

var request = require('request');
var fs = require('fs');

var logger = require('./log');
var appConfig = require('./app-config');

// Get updated configuration & save to file for future use
exports.getConfig = function() {
  logger.info("Starting TMDB");

  appConfig.get().then(function(config){
    if(!config || !config.tmdb || !config.tmdb.key) return logger.error("Missing TMDB config");
    var options = {
      url: 'https://api.themoviedb.org/3/configuration?api_key=' + config.tmdb.key,
      headers: { 'Content-Type': 'application/json' }
    };

    request(options, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        logger.error(error);
      } else {
        try {
          body = JSON.parse(body);

          fs.writeFile("./config/tmdb.json", JSON.stringify(body, null, 4), function(err) {
            if(err) {
              return logger.error(err);
            }
          });
        } catch (err){
          logger.error("unable to parse tmdb response body", err);
        }
      }
    });
  }).catch(function(err){
    logger.error("TMDB error", err);
  });

};
