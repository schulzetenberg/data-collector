const appConfig = require('../models/app-config');
const logger = require('./log');

exports.run = function() {
  var configDoc = new appConfig({ });

  configDoc.save().catch(function(err) {
    logger.error(err);
  });
};
