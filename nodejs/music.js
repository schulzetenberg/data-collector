const Q = require('q');
var moment = require('moment');

const logger = require('./log');
const musicModel = require('../models/music-model');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = function() {
  logger.info('Starting music save');

  appConfig.get('music')
  .then(topArtists)
  .then(recentTracks)
  .then(topArtistGenres)
  .then(save)
  .then(function(){
    logger.info('Saved music data');
  })
  .catch(function(err){
    logger.error('Caught music error', err);
  });
};

// Get the top 15 artists & total artists listened to in the past 12 months
function topArtists(config) {
  const defer = Q.defer();
  const key = config && config.music && config.music.lastFmKey;

  if(key){
    const url = 'http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=waterland15&limit=15&page=1&api_key=' + key + '&format=json&period=12month';
    var temp = [];

    api.get({url}).then(function(data){
      if(!data || !data.topartists || !data.topartists.artist || !data.topartists.artist.length || !data.topartists['@attr']) {
        return defer.reject('Could not parse top artist data');
      }

      const artistData = data.topartists.artist;
      const artistCount = data.topartists['@attr'].total;

      for (let i=0; i < artistData.length; i++){
        temp.push({
          artist: artistData[i].name,
          img: artistData[i].image[2]['#text'] // IMAGE SIZES: 0 = S, 1 = M, 2 = L, 3 = XL, 4 = Mega
        });
      }

      const res = {
        config: config,
        key: key,
        artistCount: artistCount,
        topArtists: temp
      };
      defer.resolve(res);

    }).catch(function(err){
      logger.error(err);
      defer.reject('Get LastFM top artists error');
    });
  } else {
    defer.reject('Missing LastFM key');
  }

  return defer.promise;
}

// Get song count (past year)
function recentTracks(promiseData) {
  const defer = Q.defer();
  const fromDate = moment().subtract(1, 'years').unix();
  const toDate = moment().unix();
  const url = 'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=waterland15&limit=1&page=1&api_key=' +
    promiseData.key + '&format=json&from=' + fromDate + '&to=' + toDate;

  api.get({url}).then(function(data){
    if(!data || !data.recenttracks || !data.recenttracks['@attr']) return defer.reject('Could not parse recent tracks data');
    promiseData.songCount = data.recenttracks['@attr'].total;
    defer.resolve(promiseData);
  }).catch(function(err){
    logger.error(err);
    defer.reject('Get LastFM recent tracks error');
  });

  return defer.promise;
}

function topArtistGenres(promiseData) {
  const defer = Q.defer();
  var promises = [];

  for (let i=0, x=promiseData.topArtists.length; i<x; i++) {
    promises.push(getArtistGenres(promiseData.config, promiseData.topArtists[i]));
  }

  Q.all(promises).then(function(data){
    promiseData.topArtists = data;
    defer.resolve(promiseData);
  }).catch(function(err){
    defer.reject(err);
  })

  return defer.promise;
}

function getArtistGenres(config, artist) {
  const defer = Q.defer();

  const postOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: { grant_type: "client_credentials" },
    auth: {
      user: config.music.spotifyId,
      password: config.music.spotifySecret
    }
  };

  api.post(postOptions).then(function(data) {
    const accessToken = data && data.access_token;

    if(accessToken){
      const getOptions = {
        url: 'https://api.spotify.com/v1/search?q=' + artist.artist + '&type=artist&market=' + 'US' + '&limit=1&offset=' + '0',
        headers: { Authorization: 'Bearer ' + accessToken }
      };
      return getOptions;
    } else {
      return Promise.reject('Error parsing access token');
    }
  }).then(api.get)
  .then(function(data) {
    if(!data || !data.artists || !data.artists.items || !data.artists.items[0] || !data.artists.items[0].genres){
      return defer.reject('Could not parse genre data');
    }

    artist.genres = data.artists.items[0].genres;

    defer.resolve(artist);
  }).catch(function(err){
    logger.error(err);
    defer.reject('Get Spotify data error');
  });

  return defer.promise;
}

function save(data) {
  const doc = new musicModel(data);
  return doc.save();
}
