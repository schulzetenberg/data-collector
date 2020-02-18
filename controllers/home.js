const path = require('path');

exports.getReactPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'), { title: 'React' });
};
