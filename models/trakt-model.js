const mongoose = require('mongoose');

module.exports = mongoose.model('trakt', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 7 }, // Delete documents after 7 days
  stats: {},
  topMovies: {},
  topShows: {},
});
