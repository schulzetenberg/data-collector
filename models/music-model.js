const mongoose = require('mongoose');

module.exports = mongoose.model('music', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 30 }, // Delete documents after 30 days
  songCount: Number,
  artistCount: Number,
  topArtists: [
    {
      artist: String,
      img: String,
      genres: [],
    },
  ],
});
