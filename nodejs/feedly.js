const Q = require('q');
const opmlToJSON = require('opml-to-json');

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
  const defer = Q.defer();
  const opml = config && config.feedly && config.feedly.opml;

  if (!opml) {
    defer.reject('Missing Feedly opml config');
  } else {
    try {
      opmlToJSON(opml, (err, json) => {
        if (err) {
          return defer.reject(err);
        }

        defer.resolve(json && json.children);
      });
    } catch (err) {
      defer.reject(err);
    }
  }

  return defer.promise;
}
