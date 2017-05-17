module.exports = require('mongoose').model('github', {
  timestamp : { type: Date, default: Date.now, expires: 60*60*24*7 }, // Delete documents after 7 days
  repos: Number,
  contribSvg: String
});
