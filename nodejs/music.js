var request = require('request');
var Q = require('q');
var moment = require('moment');

var logger = require('./log');
var musicModel = require('../models/music-model');
var appConfig = require('./app-config');

exports.save = function() {
  logger.info("Starting music save");

  appConfig.get().then(topArtists).then(recentTracks).then(topArtistGenres).then(save).catch(function(err){
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
    promises.push(getArtistGenres(promiseData.topArtists[i]));
  }

  Q.all(promises).then(function(data){
    promiseData.topArtists = data;
    defer.resolve(promiseData);
  }).catch(function(err){
    defer.reject(err);
  })

  return defer.promise;
}

function getArtistGenres(artist) {
  var defer = Q.defer();

  var reqParams = {
    name: artist.artist,
    market: 'US',
    offset: '0'
  };

  var url = 'https://api.spotify.com/v1/search?q=' + reqParams.name + '&type=artist&market=' + reqParams.market + '&limit=1&offset=' + reqParams.offset;

  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      defer.reject("Get artist genre error for:" + artist.artist);
    } else {
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
    }
  });

  return defer.promise;
}

function save(data) {
  var defer = Q.defer();

  var doc = new musicModel(data);

  doc.save(function(err) {
    if (err) {
      defer.reject(err);
    } else {
      defer.resolve();
    }
  });

  return defer.promise;
}
