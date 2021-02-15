const opmlToJSON = require('opml-to-json');
const { parseString } = require('xml2js');
const { promisify } = require('util');
const cloudinary = require('cloudinary').v2;

const cloudinaryUploadAsync = promisify(cloudinary.uploader.upload);
const opmlToJSONPromise = promisify(opmlToJSON);

const logger = require('./log');
const appConfig = require('./app-config');
const api = require('./api');
const PlayerFmModel = require('../models/player-fm-model');

exports.save = (userId) => {
  return appConfig
    .get(userId)
    .then(currentPodcasts)
    .then(({ config, podcasts }) => {
      const artworkPromises = podcasts.map((podcast) => getArtwork({ config, podcast }));
      return Promise.all(artworkPromises);
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
    .then((data) => ({ config, podcasts: data.children }));
}

function getArtwork({ config, podcast }) {
  // Make a HTTP request to the podcast URL to find the artwork URL
  return api
    .get({ url: podcast.xmlurl })
    .then((xmlData) => {
      let img = null;

      try {
        parseString(xmlData, (err, result) => {
          if (err) Error(err);

          if (result.rss.channel[0].title[0] === 'Reply All') {
            // RSS feed image is 20MB, use hardcoded value instead
            img = 'https://cdn.player.fm/images/192225/series/f90YJXRWZCrEzwXn/512.png';
          } else {
            img = result.rss.channel[0]['itunes:image'][0].$.href; // Use itunes image since it seems more universal than the 'image' attribute
          }
        });
      } catch (err) {
        logger.error(`Could not get podcast artwork for ${podcast.text}`, err);
      }

      const podcastData = {
        title: podcast.text.trim(),
        xmlUrl: podcast.xmlurl.trim(),
        htmlUrl: podcast.htmlurl.trim(),
        imgUrl: img.trim(),
      };

      return podcastData;
    })
    .then((data) => {
      // If the image is hosted in S3, Cloudinary does not allow us to use other people's buckets
      // We have to download this image and upload our local copy
      if (data.imgUrl.includes('s3://')) {
        return api
          .get({
            url: data.imgUrl,
            encoding: null,
            fullResponse: true,
          })
          .then((response) => {
            // eslint-disable-next-line no-param-reassign
            data.imgUrl = `data:${response.headers['content-type']};base64,${response.body.toString('base64')}`;
            return data;
          });
        // eslint-disable-next-line no-else-return
      } else {
        return Promise.resolve(data);
      }
    })
    .then(async (data) => {
      if (!config.playerFm.cloudinaryUpload) {
        return data;
      }

      try {
        const response = await cloudinaryUploadAsync(data.imgUrl, {
          folder: 'podcasts',
          // Assign a public id so that when we upload an image with the same id, it will replace the previous one
          public_id: `${data.title}-podcast`
            .replace(/ /g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '')
            .toLowerCase()
            .substring(0, 100),
          transformation: [{ flags: 'force_strip', height: 160, width: 160, quality: 'auto:good', crop: 'fill' }],
        });

        if (response && response.secure_url) {
          // eslint-disable-next-line no-param-reassign
          data.imgUrl = response.secure_url;
        }
      } catch (e) {
        logger.error('Error uploading podcast artwork to cloudinary!', e);
      }

      return data;
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
