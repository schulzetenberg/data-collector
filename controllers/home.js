/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
	req.flash('info', 'info');
	req.flash('errors', 'errors');
	req.flash('warning', 'warning');
	req.flash('success', 'success');
  res.render('home.html', {
    title: 'Home'
  });
};