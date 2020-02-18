const opmlToJSON = require('opml-to-json');
const util = require('util');

const opmlToJSONPromise = util.promisify(opmlToJSON);

const logger = require('./log');
const appConfig = require('./app-config');
const FeedlyModel = require('../models/feedly-model');

exports.save = (userId) => {
  logger.info('Starting Feedly');

  appConfig
    .get(userId)
    .then(currentBlogs)
    .then((feeds) => {
      const doc = new FeedlyModel({ feeds, userId });
      return doc.save();
    })
    .catch((err) => {
      logger.error('Feedly error', err);
    });
};

function currentBlogs(config) {
  const opml = config && config.feedly && config.feedly.opml;

  if (!opml) {
    return Promise.reject('Missing Feedly opml config');
  }

  return opmlToJSONPromise(opml).then((json) => {
    return json && json.children;
  });
}
