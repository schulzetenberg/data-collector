/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('home.html', {
    title: 'Home'
  });
};