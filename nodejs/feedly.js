const opmlToJSON = require('opml-to-json');
const util = require('util');

const opmlToJSONPromise = util.promisify(opmlToJSON);

const appConfig = require('./app-config');
const FeedlyModel = require('../models/feedly-model');

exports.save = (userId) => {
  return appConfig
    .get(userId)
    .then(getCurrentBlogs)
    .then((feeds) => {
      const doc = new FeedlyModel({ feeds, userId });
      return doc.save();
    });
};

function getCurrentBlogs(config) {
  const opml = config && config.feedly && config.feedly.opml;

  if (!opml) {
    return Promise.reject('Missing Feedly opml config');
  }

  return opmlToJSONPromise(opml).then((json) => {
    return json && json.children;
  });
}
