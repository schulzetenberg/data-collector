const mongoose = require('mongoose');

module.exports = mongoose.model('parks', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  parks: [
    {
      name: String,
      imageUrl: String,
      State: String,
      location: String,
    },
  ],
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 }, // Delete documents after 90 days
});
