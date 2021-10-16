// NOTE: This only works for public instagram accounts

const { promisify } = require('util');
const cloudinary = require('cloudinary').v2;

const cloudinaryUploadAsync = promisify(cloudinary.uploader.upload);

const logger = require('./log');
const appConfig = require('./app-config');
const api = require('./api');
const InstagramModel = require('../models/instagram-model');

exports.save = (userId) => {
  return appConfig
    .get(userId)
    .then(getProfile)
    .then(({ config, images }) => {
      const imagePromises = images.map((image) => uploadImages({ config, image }));
      return Promise.all(imagePromises);
    })
    .then((images) => {
      const doc = new InstagramModel({ images, userId });
      return doc.save();
    });
};

function getProfile(config) {
  return api
    .get({ url: `https://www.instagram.com/${config.instagram.user}/?__a=1` })
    .then((data) => {
      const images = data.graphql.user.edge_owner_to_timeline_media.edges
        .map(({ node }) => ({
          caption: node.edge_media_to_caption.edges[0].node.text,
          imgUrl: node.display_url,
          postUrl: `https://www.instagram.com/p/${node.shortcode}/`,
          id: node.id,
          is_video: node.is_video,
        }))
        .filter((x) => x.is_video === false);

      return { config, images };
    })
    .catch((err) => {
      logger.error('Error getting instagram data');
      logger.error(err);
    });
}

async function uploadImages({ config, image }) {
  if (!config.instagram.cloudinaryUpload) {
    return image;
  }

  try {
    const response = await cloudinaryUploadAsync(image.imgUrl, {
      folder: 'instagram',
      // Assign a public id so that when we upload an image with the same id, it will replace the previous one
      public_id: `${image.id}-instagram`,
      transformation: [{ flags: 'force_strip', height: 160, width: 160, quality: 'auto:good', crop: 'fill' }],
    });

    if (response && response.secure_url) {
      // eslint-disable-next-line no-param-reassign
      image.imgUrl = response.secure_url;
    }
  } catch (e) {
    logger.error('Error uploading instagram image to cloudinary!', e);
  }

  return image;
}
