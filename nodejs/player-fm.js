const Q = require('q');
const opmlToJSON = require('opml-to-json');
const { parseString } = require('xml2js');
const util = require('util');

const opmlToJSONPromise = util.promisify(opmlToJSON);

const logger = require('./log');
const appConfig = require('./app-config');
const api = require('./api');
const PlayerFmModel = require('../models/player-fm-model');

exports.save = (userId) => {
  return appConfig
    .get(userId)
    .then(currentPodcasts)
    .then((podcasts) => {
      const artworkPromises = podcasts.map((podcast) => getArtwork(podcast));
      return Q.all(artworkPromises);
    })
    .then((podcasts) => {
      const doc = new PlayerFmModel({ podcasts, userId });
      return doc.save();
    });
};

function currentPodcasts(config) {
  const user = config && config.playerFm && config.playerFm.user;

  if (!user) {
    return Promise.reject('Missing playerFm config');
  }

  const url = `https://player.fm/${user}/fm.opml`;

  return api
    .get({ url })
    .then(opmlToJSONPromise)
    .then((data) => data.children);
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
