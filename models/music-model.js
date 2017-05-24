module.exports = require('mongoose').model('music', {
  timestamp : { type: Date, default: Date.now, expires: 60*60*24*7 }, // Delete documents after 7 days
  songCount: Number,
  artistCount: Number,
  topArtists: [{
    artist: String,
    img: String,
    genres: []
  }]
});
