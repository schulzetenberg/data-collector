/**
 * GET /settings
 * Advanced settings page.
 */
exports.getSettings = function(req, res) {
  res.render('settings.html', { title: 'Advanced Settings' });
};
