const mongoose = require('mongoose');

module.exports = mongoose.model('github', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now, expires: 60 * 60 * 24 * 90 }, // Delete documents after 90 days
  repos: { type: Number },
  contributions: { type: Number },
  contribSvg: { type: String },
  following: [
    {
      type: { type: String },
      html_url: { type: String },
      url: { type: String },
      avatar_url: { type: String },
      id: { type: Number },
      login: { type: String },
    },
  ],
  followers: [
    {
      type: { type: String },
      html_url: { type: String },
      url: { type: String },
      avatar_url: { type: String },
      id: { type: Number },
      login: { type: String },
    },
  ],
});
