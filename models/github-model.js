const mongoose = require('mongoose');

module.exports = mongoose.model('github', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 }, // Delete documents after 90 days
  publicRepos: { type: Number },
  privateRepos: { type: Number },
  publicGists: { type: Number },
  privateGists: { type: Number },
  contributions: { type: Number },
  contribSvg: { type: String },
  following: { type: Number },
  followers: { type: Number },
});
