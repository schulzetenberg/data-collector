/**
 * GET /settings
 * Advanced settings page.
 */
exports.getSettings = (req, res) => {
  res.render('settings.html', { title: 'Advanced Settings' });
};
