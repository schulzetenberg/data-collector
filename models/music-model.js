module.exports = require('mongoose').model('music', {
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
