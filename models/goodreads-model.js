const mongoose = require('mongoose');

module.exports = mongoose.model('goodreads', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 }, // Delete documents after 90 days
  booksRead: [{}],
});
