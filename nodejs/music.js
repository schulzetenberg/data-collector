const { promisify } = require('util');
const moment = require('moment');
const cloudinary = require('cloudinary').v2;

const logger = require('./log');
const MusicModel = require('../models/music-model');
const appConfig = require('./app-config');
const api = require('./api');

const cloudinaryUploadAsync = promisify(cloudinary.uploader.upload);

exports.save = (userId) => {
  return appConfig
    .get(userId)
    .then(getTopArtists)
    .then(recentTracks)
    .then(topArtistData)
    .then((data) => {
      const doc = new MusicModel({ ...data, userId });
      return doc.save();
    });
};

// Get the top 15 artists & total artists listened to in the past 12 months
function getTopArtists(config) {
  const key = config && config.music && config.music.lastFmKey;

  if (!key) return Promise.reject('Missing LastFM key');

  const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopartists&user=waterland15&limit=15&page=1&api_key=${key}&format=json&period=12month`;

  return api.get({ url }).then((data) => {
    if (
      !data ||
      !data.topartists ||
      !data.topartists.artist ||
      !data.topartists.artist.length ||
      !data.topartists['@attr']
    ) {
      return Promise.reject('Could not parse top artist data');
    }

    const artistData = data.topartists.artist;
    const artistCount = data.topartists['@attr'].total;

    // NOTE: Do not get the artist images from last.fm because their API is unreliable. We are going to use Spotify instead
    // img: artist.image[2]['#text'] // IMAGE SIZES: 0 = S, 1 = M, 2 = L, 3 = XL, 4 = Mega
    const topArtists = artistData.map((artist) => ({ artist: artist.name }));

    const res = {
      config,
      key,
      artistCount,
      topArtists,
    };

    return res;
  });
}

// Get song count (past year)
function recentTracks(promiseData) {
  const fromDate = moment()
    .subtract(1, 'years')
    .unix();

  const toDate = moment().unix();
  const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=waterland15&limit=1&page=1&api_key=${promiseData.key}&format=json&from=${fromDate}&to=${toDate}`;

  return api.get({ url }).then((data) => {
    if (!data || !data.recenttracks || !data.recenttracks['@attr']) {
      return Promise.reject('Could not parse recent tracks data');
    }

    const tracksData = {
      ...promiseData,
      songCount: data.recenttracks['@attr'].total,
    };

    return tracksData;
  });
}

function topArtistData(promiseData) {
  const artistPromises = promiseData.topArtists.map((artist) => getSpotifyArtist(promiseData.config, artist));

  return Promise.all(artistPromises).then((data) => {
    const topArtistsData = {
      ...promiseData,
      topArtists: data,
    };

    return topArtistsData;
  });
}

function getSpotifyArtist(config, artist) {
  const postOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: { grant_type: 'client_credentials' },
    auth: {
      user: config.music.spotifyId,
      password: config.music.spotifySecret,
    },
  };

  return api
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
        return Promise.reject('Could not parse genre data');
      }

      const artistData = data.artists.items[0];
      const img320 = artistData.images.find((img) => img.width === 320);

      const updatedArtist = {
        ...artist,
        // If we can't find the 320x320 image, use the first image in the array (640x640 most likely)
        img: img320 ? img320.url : artistData.images[0].url,
        genres: artistData.genres,
      };

      return updatedArtist;
    })
    .then(async (data) => {
      if (!config.music.cloudinaryUpload) {
        return data;
      }

      try {
        const response = await cloudinaryUploadAsync(data.img, {
          transformation: [
            {
              effect: 'saturation:-15',
              flags: 'force_strip',
              height: 320,
              opacity: 70,
              width: 320,
              quality: 'auto:good',
              crop: 'fill',
            },
            { height: 320, opacity: 60, underlay: '0858ed8417a0d064a72e5c619215ced9_jolcxh', width: 320, crop: 'fill' },
          ],
        });

        if (response && response.secure_url) {
          // eslint-disable-next-line no-param-reassign
          data.img = response.secure_url;
        }
      } catch (e) {
        logger.error('Error uploading artist artwork to cloudinary!', e);
      }

      return data;
    });
}
