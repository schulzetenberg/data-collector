const path = require('path');

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

exports.getReactPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'), { title: 'React' });
};
