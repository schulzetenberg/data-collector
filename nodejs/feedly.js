const opmlToJSON = require('opml-to-json');
const util = require('util');

const opmlToJSONPromise = util.promisify(opmlToJSON);

const appConfig = require('./app-config');
const FeedlyModel = require('../models/feedly-model');
const api = require('./api');

exports.save = (userId) =>
  appConfig
    .get(userId)
    .then(getCurrentBlogs)
    .then(opmlToJSONPromise)
    .then(parseResponse)
    .then((feeds) => {
      const doc = new FeedlyModel({ feeds, userId });
      return doc.save();
    });

function getCurrentBlogs(config) {
  const token = config && config.feedly && config.feedly.token;

  if (!token) {
    return Promise.reject('Missing Feedly access token');
  }

  return api.get({
    url: 'https://cloud.feedly.com/v3/opml',
    headers: { Authorization: token },
  });
}

function parseResponse(responseData) {
  const blogArray = [];

  responseData.children.forEach((feed) => {
    if (feed.children) {
      feed.children.forEach((blog) => {
        // Remove trailing whitespace after conversion to JSON
        Object.keys(blog).map((k) => blog[k].trim());

        blogArray.push(blog);
      });
    }
  });

  return Promise.resolve(blogArray);
}
