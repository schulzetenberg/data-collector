/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  req.flash('info', { msg: 'Info messages go here' });
  req.flash('error', { msg: 'Error messages go here' });
  req.flash('warning', { msg: 'Warning messages go here' });
  req.flash('success', { msg: 'Success messages go here' });
  res.render('home.html', { title: 'Home' });
};
