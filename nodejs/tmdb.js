/*
  Using TMDB to get the best images:
  https://apiblog.trakt.tv/how-to-find-the-best-images-516045bcc3b6#.gjylr224j
 */

const fs = require('fs');

const api = require('./api');
const logger = require('./log');
const appConfig = require('./app-config');

// Get updated configuration & save to file for future use
exports.getConfig = function() {
  logger.info('Starting TMDB');

  appConfig.get().then(function(config){
    if(!config || !config.tmdb || !config.tmdb.key) return logger.error('Missing TMDB config');
    const options = {
      url: 'https://api.themoviedb.org/3/configuration?api_key=' + config.tmdb.key,
      headers: { 'Content-Type': 'application/json' }
    };

    api.get(options).then(function(body){
      fs.writeFile('./config/tmdb.json', JSON.stringify(body, null, 4), function(err){
        if(err) {
          return logger.error(err);
        }
      });
    }).catch(function(err){
      logger.error(err);
    });
  }).catch(function(err){
    logger.error('TMDB error', err);
  });

};
