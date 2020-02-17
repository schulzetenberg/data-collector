/*
  Using TMDB to get the best images:
  https://apiblog.trakt.tv/how-to-find-the-best-images-516045bcc3b6#.gjylr224j
 */

const { promisify } = require('util');
const fs = require('fs');

const writeFileAsync = promisify(fs.writeFile);

const api = require('./api');
const appConfig = require('./app-config');

// Get updated configuration & save to file for future use
exports.save = (userId) => {
  return appConfig
    .get(userId)
    .then((config) => {
      if (!config || !config.tmdb || !config.tmdb.key) {
        return Promise.reject('Missing TMDB config');
      }

      const options = {
        url: `https://api.themoviedb.org/3/configuration?api_key=${config.tmdb.key}`,
        headers: { 'Content-Type': 'application/json' },
      };

      return options;
    })
    .then(api.get)
    .then((body) => {
      return writeFileAsync('./config/tmdb.json', JSON.stringify(body, null, 4));
    });
};
