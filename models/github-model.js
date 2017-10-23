module.exports = require('mongoose').model('github', {
  timestamp : { type: Date, default: Date.now, expires: 60*60*24*30 }, // Delete documents after 30 days
  repos: { type: Number },
  contribSvg: { type: String },
  following: [{
    type: { type: String },
    html_url: { type: String },
    url: { type: String },
    avatar_url: { type: String },
    id: { type: Number },
    login: { type: String }
  }],
  followers: [{
    type: { type: String },
    html_url: { type: String },
    url: { type: String },
    avatar_url: { type: String },
    id: { type: Number },
    login: { type: String }
  }]
});
