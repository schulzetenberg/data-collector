var Q = require('q');

var config = require('../models/app-config');

exports.get = function(){
    var defer = Q.defer();

    config.findOne('', '', {sort: {'_id' : -1}}).lean().exec(function(err, data) {
        if (err) return defer.reject(err);
        if (!data) return defer.reject("No config saved in db");
        defer.resolve(data);
    });

    return defer.promise;
};
