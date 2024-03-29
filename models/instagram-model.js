const mongoose = require('mongoose');

module.exports = mongoose.model('instagram', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 1000 }, // Delete documents after 1000 days
  images: [
    {
      caption: String,
      imgUrl: String,
      postUrl: String,
      id: String,
    },
  ],
});
