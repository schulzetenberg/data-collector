const Q = require('q');

const configModel = require('../models/app-config');

exports.get = function() {
  return configModel.findOne({}, '', {sort: {'_id' : -1}}).lean();
};

exports.app = function(filter) {
  var defer = Q.defer();

  filter = filter ? filter : ''; // Set filter to '' if not specified

  configModel.findOne({}, filter, {sort: {'_id' : -1}}).lean().then(function(data) {
    if (!data) {
      defer.reject('No config saved in db');
    } else if (filter && !data[filter]) {
      defer.reject('No config found for "' + filter + '"');
    } else {
      if(filter) {
        data = data[filter];
      }

      defer.resolve(data);
    }
  }).catch(function(err) {
    defer.reject(err);
  })

  return defer.promise;
};
