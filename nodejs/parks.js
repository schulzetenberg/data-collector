const { promisify } = require('util');
const cloudinary = require('cloudinary').v2;

const logger = require('./log');
const appConfig = require('./app-config');
const secrets = require('../config/secrets');
const parksList = require('../config/parks');

const cloudinaryUploadAsync = promisify(cloudinary.uploader.upload);

exports.get = (userId) =>
  appConfig.get(userId).then((config) => {
    const visited = config && config.parks && config.parks.visited;

    if (!visited) {
      return Promise.reject('Parks config is missing');
    }

    const responseData = visited.map((x) => ({ ...parksList.find((p) => x.value === p.value), imageUrl: x.imageUrl }));
    return responseData;
  });

exports.uploadAllImages = (parksConfig, userId) => {
  const parkPromises = parksConfig.visited.map((park) => uploadImage(parksConfig, park, userId));

  return Promise.all(parkPromises);
};

async function uploadImage(parksConfig, park, userId) {
  // Dont upload image if the setting is off or the image is already uploaded
  if (!parksConfig.cloudinaryUpload || park.imageUrl.includes(`res.cloudinary.com/${secrets.cloudinary.cloud_name}`)) {
    return park;
  }

  try {
    const response = await cloudinaryUploadAsync(park.imageUrl, {
      folder: 'parks',
      // Assign a public id so that when we upload an image with the same id, it will replace the previous one
      public_id: `${userId}-${park.value}-park`
        .replace(/ /g, '-')
        .replace(/[^a-zA-Z0-9-_]/g, '')
        .toLowerCase()
        .substring(0, 100),
      transformation: [
        { effect: 'art:sonnet', height: 140, width: 140, crop: 'lfill', quality: 'auto:good' },
        { effect: 'colorize:15' }, // TODO: Upload not visited with colorize 75
        {
          background: '#ffffff',
          effect: 'hue:5',
          radius: 10,
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
