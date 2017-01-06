var appConfig = require('../models/app-config');

exports.run = function() {
  var configDoc = new appConfig({ });

  configDoc.save(function(err) {
    if (err) console.log(err);
  });
};
