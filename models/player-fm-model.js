const mongoose = require('mongoose');

module.exports = mongoose.model('playerfm', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 }, // Delete documents after 90 days
  podcasts: [
    {
      title: { type: String },
      xmlUrl: { type: String },
      htmlUrl: { type: String },
      imgUrl: { type: String },
    },
  ],
});
