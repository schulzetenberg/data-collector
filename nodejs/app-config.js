const Q = require('q');

const configModel = require('../models/app-config');

exports.get = (userId) => {
  return configModel.findOne({ userId }, {}, { sort: { _id: -1 } }).lean();
};

exports.app = (userId, filter) => {
  const defer = Q.defer();

  // eslint-disable-next-line no-param-reassign
  filter = filter || ''; // Set filter to '' if not specified

  configModel
    .findOne({ userId }, filter, { sort: { _id: -1 } })
    .lean()
    .then((data) => {
      if (!data) {
        defer.reject('No config saved in db');
      } else if (filter && !data[filter]) {
        defer.reject(`No config found for "${filter}"`);
      } else {
        if (filter) {
          // eslint-disable-next-line no-param-reassign
          data = data[filter];
        }

        defer.resolve(data);
      }
    })
    .catch((err) => {
      defer.reject(err);
    });

  return defer.promise;
};
