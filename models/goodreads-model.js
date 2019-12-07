module.exports = require('mongoose').model('goodreads', {
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // Delete documents after 30 days
  booksRead: [{}],
});
