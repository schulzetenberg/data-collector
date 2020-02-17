const Q = require('q');
const opmlToJSON = require('opml-to-json');
const { parseString } = require('xml2js');

const logger = require('./log');
const appConfig = require('./app-config');
const api = require('./api');
const PlayerFmModel = require('../models/player-fm-model');

exports.save = (userId) => {
  appConfig
    .get(userId)
    .then(currentPodcasts)
    .then((podcasts) => {
      const promises = [];

      for (let i = 0, x = podcasts.length; i < x; i += 1) {
        promises.push(getArtwork(podcasts[i]));
      }

      return Q.all(promises);
    })
    .then((podcasts) => {
      const doc = new PlayerFmModel({ podcasts, userId });
      return doc.save();
    })
    .catch((err) => {
      logger.error('PlayerFM error', err);
    });
};

function currentPodcasts(config) {
  const defer = Q.defer();

  const user = config && config.playerFm && config.playerFm.user;

  if (!user) {
    defer.reject('Missing playerFm config');
  } else {
    const url = `https://player.fm/${user}/fm.opml`;

    api
      .get({ url })
      .then((body) => {
        try {
          opmlToJSON(body, (err, json) => {
            if (err) {
              return defer.reject(err);
            }

            defer.resolve(json.children);
          });
        } catch (err) {
          defer.reject(err);
        }
      })
      .catch((err) => {
        logger.error(err);
        defer.reject('Get PlayerFM podcasts error');
      });
  }

  return defer.promise;
}

function getArtwork(podcast) {
  // Make a HTTP request to the podcast URL to find the artwork URL
  return api
    .get({ url: podcast.xmlurl })
    .then((xmlData) => {
      let img = null;

      try {
        parseString(xmlData, (err, result) => {
          if (err) Error(err);

          img = result.rss.channel[0]['itunes:image'][0].$.href; // Use itunes image since it seems more universal than the 'image' attribute
        });
      } catch (err) {
        logger.error(`Could not get podcast artwork for ${podcast.text}`, err);
      }

      const podcastData = {
        title: podcast.text,
        xmlUrl: podcast.xmlurl,
        htmlUrl: podcast.htmlurl,
        imgUrl: img,
      };

      return podcastData;
    })
    .catch((err) => {
      logger.error(`Error getting podcast artwork for ${podcast.text}`);
      logger.error(err);

      const podcastData = {
        title: podcast.text,
        xmlUrl: podcast.xmlurl,
        htmlUrl: podcast.htmlurl,
        imgUrl: null,
      };

      return podcastData;
    });
}
