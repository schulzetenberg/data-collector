var Q = require('q');

var configModel = require('../models/app-config');

exports.get = function(){
    var defer = Q.defer();

    configModel.findOne('', '', {sort: {'_id' : -1}}).lean().exec(function(err, data) {
        if (err) return defer.reject(err);
        defer.resolve(data);
    });

    return defer.promise;
};

exports.app = function(filter){
  var defer = Q.defer();

  filter = filter ? filter : ''; // Set filter to '' if not specified

  configModel.findOne('', filter, {sort: {'_id' : -1}}).lean().exec(function(err, data) {
    if(err) return defer.reject(err);
    if(!data) return defer.reject("No config saved in db");
    if(filter && !data[filter]) return defer.reject("No config found for '" + filter + "'");
    if(filter) data = data[filter];

    defer.resolve(data);
  });

  return defer.promise;
};
