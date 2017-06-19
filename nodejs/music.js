var request = require('request');
var rp = require('request-promise-native');
var Q = require('q');
var moment = require('moment');

var logger = require('./log');
var musicModel = require('../models/music-model');
var appConfig = require('./app-config');

exports.save = function() {
  logger.info("Starting music save");

  appConfig.get('music')
  .then(topArtists)
  .then(recentTracks)
  .then(topArtistGenres)
  .then(save)
  .then(function(){
    logger.info('Saved music data');
  })
  .catch(function(err){
    logger.error("Caught music error", err);
  });
};

// Get the top 15 artists & total artists listened to in the past 12 months
function topArtists(config) {
  var defer = Q.defer();
  var key = config && config.music && config.music.lastFmKey;
  if(key){
    var url = "http://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=waterland15&limit=15&page=1&api_key=" + key + "&format=json&period=12month";

    var temp = [];
    request(url, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        defer.reject("Get LastFM top artists error");
      } else {
        try {
          var data = JSON.parse(body);

          if(!data || !data.topartists || !data.topartists.artist || !data.topartists.artist.length || !data.topartists['@attr']) {
            return defer.reject("Could not parse top artist data");
          }

          var artistData = data.topartists.artist;
          var artistCount = data.topartists['@attr'].total;

          for (var i=0; i < artistData.length; i++){
            temp.push({
              artist: artistData[i].name,
              img: artistData[i].image[2]['#text'] // IMAGE SIZES: 0 = S, 1 = M, 2 = L, 3 = XL, 4 = Mega
            });
          }

          var res = {
            config: config,
            key: key,
            artistCount: artistCount,
            topArtists: temp
          };
          defer.resolve(res);
        } catch(err){
          defer.reject(err);
        }
      }
    });
  } else {
    defer.reject("Missing LastFM key");
  }

  return defer.promise;
}

// Get song count (past year)
function recentTracks(promiseData) {
  var defer = Q.defer();
  var fromDate = moment().subtract(1, 'years').unix();
  var toDate = moment().unix();
  var url = "http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=waterland15&limit=1&page=1&api_key=" +
    promiseData.key + "&format=json&from=" + fromDate + "&to=" + toDate;

  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      defer.reject("Get LastFM recent tracks error");
    } else {
      try {
        var data = JSON.parse(body);
        if(!data || !data.recenttracks || !data.recenttracks['@attr']) return defer.reject("Could not parse recent tracks data");
        promiseData.songCount = data.recenttracks['@attr'].total;
        defer.resolve(promiseData);
      } catch(err){
        defer.reject(err);
      }
    }
  });

  return defer.promise;
}

function topArtistGenres(promiseData) {
  var defer = Q.defer();
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
  var defer = Q.defer();

  var postOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {'grant_type': 'client_credentials', 'client_id': config.music.spotifyId, 'client_secret': config.music.spotifySecret}
  };

  rp.post(postOptions).then(function(response) {
    try {
      var data = JSON.parse(response);
      var access_token = data && data.access_token;

      if(access_token){
        var getOptions = {
          url: 'https://api.spotify.com/v1/search?q=' + artist.artist + '&type=artist&market=' + 'US' + '&limit=1&offset=' + '0',
          auth: { 'bearer': data.access_token }
        };
        return getOptions;
      } else {
        defer.reject("Error parsing access token");
      }
    } catch (err) {
      defer.reject(err);
    }
  })
  .then(rp.get).then(function(body) {
    try {
      var data = JSON.parse(body);

      if(!data || !data.artists || !data.artists.items || !data.artists.items[0] || !data.artists.items[0].genres){
        return defer.reject("Could not parse genre data");
      }

      artist.genres = data.artists.items[0].genres;

      defer.resolve(artist);
    } catch(err){
      defer.reject(err);
    }
  }).catch(function(err){
    logger.error(err);
    defer.reject("Get Spotify data error");
  });

  return defer.promise;
}

function save(data) {
  var doc = new musicModel(data);
  return doc.save();
}
