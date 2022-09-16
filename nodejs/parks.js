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
    .then((config) => uploadAllImages(config, userId))
    .then((parks) =>
      // Keep only 1 questions document in the DB per user. Override the existing doc if it exists
      ParksModel.findOneAndUpdate(
        { userId },
        { parks, userId },
        {
          new: true,
          upsert: true,
        }
      ).lean()
    );

function uploadAllImages(config, userId) {
  const parkPromises = parksList.map((park) => uploadImage(config, park, userId));

  return Promise.all(parkPromises);
}

async function uploadImage(config, park, userId) {
  if (!config.parks.cloudinaryUpload) {
    return park;
  }

  try {
    const response = await cloudinaryUploadAsync(park.imageUrl, {
      folder: 'parks',
      // Assign a public id so that when we upload an image with the same id, it will replace the previous one
      public_id: `${userId}-${park.name}-park`
        .replace(/ /g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '')
        .toLowerCase()
        .substring(0, 100),
      transformation: [
        {
          width: 140,
          height: 140,
          crop: 'lfill',
        },
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
