const Q = require('q');
const opmlToJSON = require ('opml-to-json');
const parseString = require('xml2js').parseString;

const logger = require('./log');
const appConfig = require('./app-config');
const api = require('./api');
const playerFmModel = require('../models/player-fm-model');

exports.save = function() {
  logger.info('Starting Goodreads');

  appConfig.get()
  .then(currentPodcasts)
  .then(function(podcasts){
    const promises = [];

    for (let i = 0, x = podcasts.length; i<x; i++) {
      promises.push(getArtwork(podcasts[i]));
    }

    return Q.all(promises);
  })
  .then(function(parsedData){
    const doc = new playerFmModel({ podcasts: parsedData });
    return doc.save();
  })
  .then(function(){
    logger.info('Finished saving Goodreads data');
  })
  .catch(function(err){
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

    api.get({ url }).then(function(body) {
      try {
        opmlToJSON(body, function (err, json) {
          if (err) {
            return defer.reject(err);
          }

          console.log("TEST", json.children[0]);

          defer.resolve(json.children);
        });
      } catch(err) {
        defer.reject(err);
      }
    }).catch(function(err) {
      logger.error(err);
      defer.reject('Get PlayerFM podcasts error');
    });
  }

  return defer.promise;
}

function getArtwork(podcast) {
  // Make a HTTP request to the podcast URL to find the artwork URL
  return api.get({ url: podcast.xmlurl }).then(function(xmlData) {
    let img = null;

    try {
      parseString(xmlData, function(err, result) {
        if (err) console.log(err);

        img = result.rss.channel[0]['itunes:image'][0].$.href; // Use itunes image since it seems more universal than the 'image' attribute
      });

    } catch (err) {
      console.log(`Could not get podcast artwork for ${podcast.text}`, err);
    }

    const podcastData = {
        title: podcast.text,
        xmlUrl: podcast.xmlurl,
        htmlUrl: podcast.htmlurl,
        imgUrl: img
    };

    return podcastData;
  }).catch(function(err) {
    logger.error(`Error getting podcast artwork for ${podcast.text}`);
    logger.error(err);

    const podcastData = {
        title: podcast.text,
        xmlUrl: podcast.xmlurl,
        htmlUrl: podcast.htmlurl,
        imgUrl: null
    };

    return podcastData;
  });
}
