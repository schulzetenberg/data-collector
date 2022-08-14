const { promisify } = require('util');
const cloudinary = require('cloudinary').v2;

const logger = require('./log');
const ParksModel = require('../models/parks-model');
const appConfig = require('./app-config');
const parksList = require('../config/parks');

const cloudinaryUploadAsync = promisify(cloudinary.uploader.upload);

exports.get = (userId) =>
  appConfig.get(userId).then((config) => {
    const visited = config && config.parks && config.parks.visited;

    if (!visited) {
      return Promise.reject('Parks config is missing');
    }

    const parkListVisited = visited.map((vistitedPark) => parksList.find((park) => park.name === vistitedPark));

    return parkListVisited;
  });

exports.save = (userId) =>
  appConfig
    .get(userId)
    .then(uploadAllImages)
    .then((parks) => {
      const doc = new ParksModel({ parks, userId });
      return doc.save();
    });

function uploadAllImages(config) {
  const parkPromises = parksList.map((park) => uploadImage(config, park));

  return Promise.all(parkPromises);
}

async function uploadImage(config, park) {
  // NOTE: This config is not availible yet, so we will never upload any images
  if (!config.parks.cloudinaryUpload) {
    return park;
  }

  try {
    const response = await cloudinaryUploadAsync(park.imageUrl, {
      folder: 'parks',
      // Assign a public id so that when we upload an image with the same id, it will replace the previous one
      public_id: `${park.name}-park`
        .replace(/ /g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '')
        .toLowerCase()
        .substring(0, 100),
      transformation: [
        {
          background: '#786262',
          effect: 'colorize:40',
          opacity: 100,
          radius: 0,
        },
        {
          effect: 'saturation:35',
          radius: 0,
        },
        {
          background: '#ffffff',
          effect: 'hue:5',
          radius: 10,
        },
        {
          effect: 'brightness:10',
        },
      ],
    });

    if (response && response.secure_url) {
      // eslint-disable-next-line no-param-reassign
      park.imageUrl = response.secure_url;
    }
  } catch (e) {
    logger.error(`Error uploading park ${park.name} image to cloudinary!`, e);
  }

  return park;
}
