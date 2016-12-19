var config = require('../models/app-config');
/**
 * GET /app-config-page
 * Application config page
 */
exports.getConfigPage = function(req, res) {
  res.render('app-config.html', { title: 'Application Configuration' });
};

/**
 * GET /app-config/config
 * Get application config
 */
exports.getConfig = function(req, res, next) {

  config.findOne({}, {}, { sort: { '_id' : -1 } },function(err, data) {
      if (err) return next(err);
      res.send(data);
  });
};

/**
 * POST /app-config
 * Save application config
 */
exports.saveConfig = function(req, res, next) {
  var data = req.body;
  if(!data) return next('No config data to save');
  delete data.updatedAt;
  delete data._id;
  var doc = new config(data);

  doc.save(function(err) {
    if (err) return next('Error saving config');
    res.sendStatus(200);
  });
};
