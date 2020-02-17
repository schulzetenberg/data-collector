const Q = require('q');
const moment = require('moment');

const logger = require('./log');
const MusicModel = require('../models/music-model');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = (userId) => {
  appConfig
    .get(userId)
    .then(topArtists)
    .then(recentTracks)
    .then(topArtistData)
    .then((data) => {
      const doc = new MusicModel({ ...data, userId });
      return doc.save();
    })
    .catch((err) => {
      logger.error('Caught music error', err);
    });
};

// Get the top 15 artists & total artists listened to in the past 12 months
function topArtists(config) {
  const defer = Q.defer();
  const key = config && config.music && config.music.lastFmKey;

  if (key) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=waterland15&limit=15&page=1&api_key=${key}&format=json&period=12month`;

    api
      .get({ url })
      .then((data) => {
        if (!data || !data.topartists || !data.topartists.artist || !data.topartists.artist.length || !data.topartists['@attr']) {
          return defer.reject('Could not parse top artist data');
        }

        const artistData = data.topartists.artist;
        const artistCount = data.topartists['@attr'].total;
        const temp = [];

        artistData.forEach((artist) => {
          temp.push({
            artist: artist.name,
            // NOTE: Do not get the artist images from last.fm because their API is unreliable. We are going to use Spotify instead
            // img: artist.image[2]['#text'] // IMAGE SIZES: 0 = S, 1 = M, 2 = L, 3 = XL, 4 = Mega
          });
        });

        const res = {
          config,
          key,
          artistCount,
          topArtists: temp,
        };

        return defer.resolve(res);
      })
      .catch((err) => {
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
  const fromDate = moment()
    .subtract(1, 'years')
    .unix();
  const toDate = moment().unix();
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=waterland15&limit=1&page=1&api_key=${promiseData.key}&format=json&from=${fromDate}&to=${toDate}`;

  api
    .get({ url })
    .then((data) => {
      if (!data || !data.recenttracks || !data.recenttracks['@attr']) {
        return defer.reject('Could not parse recent tracks data');
      }

      const tracksData = {
        ...promiseData,
        songCount: data.recenttracks['@attr'].total,
      };

      return defer.resolve(tracksData);
    })
    .catch((err) => {
      logger.error(err);
      defer.reject('Get LastFM recent tracks error');
    });

  return defer.promise;
}

function topArtistData(promiseData) {
  const defer = Q.defer();
  const promises = [];

  promiseData.topArtists.forEach((artist) => {
    promises.push(getSpotifyArtist(promiseData.config, artist));
  });

  Q.all(promises)
    .then((data) => {
      const topArtistsData = {
        ...promiseData,
        topArtists: data,
      };

      defer.resolve(topArtistsData);
    })
    .catch((err) => {
      defer.reject(err);
    });

  return defer.promise;
}

function getSpotifyArtist(config, artist) {
  const defer = Q.defer();

  const postOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: { grant_type: 'client_credentials' },
    auth: {
      user: config.music.spotifyId,
      password: config.music.spotifySecret,
    },
  };

  api
    .post(postOptions)
    .then((data) => {
      const accessToken = data && data.access_token;

      if (accessToken) {
        const getOptions = {
          url: `https://api.spotify.com/v1/search?q=${artist.artist}&type=artist&market=US&limit=1&offset=0`,
          headers: { Authorization: `Bearer ${accessToken}` },
        };

        return getOptions;
      }
      logger.error('Access token error', data && data.error);
      return Promise.reject('Error parsing access token');
    })
    .then(api.get)
    .then((data) => {
      if (!data || !data.artists || !data.artists.items || !data.artists.items[0] || !data.artists.items[0].genres) {
        return defer.reject('Could not parse genre data');
      }

      const artistData = data.artists.items[0];
      const img320 = artistData.images.find((img) => img.width === 320);

      const updatedArtist = {
        ...artist,
        // If we can't find the 320x320 image, use the first image in the array (640x640 most likely)
        img: img320 ? img320.url : artistData.images[0].url,
        genres: artistData.genres,
      };

      return defer.resolve(updatedArtist);
    })
    .catch((err) => {
      logger.error(err);
      defer.reject('Get Spotify data error');
    });

  return defer.promise;
}
