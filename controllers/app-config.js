/**
 * GET /app-config
 * Application config page.
 */
exports.getConfig = function(req, res) {
  res.render('app-config.html', { title: 'Application Configuration' });
};

/**
 * POST /app-config
 * Save application config.
 */
exports.saveConfig = function(req, res) {
  // TODO
};
