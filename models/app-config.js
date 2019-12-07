const mongoose = require('mongoose');

const appConfigSchema = new mongoose.Schema(
  {
    github: {
      filePath: { type: String, default: 'nodejs/github' },
      functionName: { type: String, default: 'save' },
      active: { type: Boolean, default: false },
      user: { type: String, default: 'schulzetenberg' },
      token: { type: String, default: '' },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    goodreads: {
      filePath: { type: String, default: 'nodejs/goodreads' },
      functionName: { type: String, default: 'save' },
      active: { type: Boolean, default: false },
      numDays: { type: Number, default: 185 },
      id: { type: Number, default: 0 },
      key: { type: String, default: '' },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    music: {
      filePath: { type: String, default: 'nodejs/music' },
      functionName: { type: String, default: 'save' },
      active: { type: Boolean, default: false },
      lastFmKey: { type: String, default: '' },
      spotifyId: { type: String, default: '' },
      spotifySecret: { type: String, default: '' },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    trakt: {
      filePath: { type: String, default: 'nodejs/trakt' },
      functionName: { type: String, default: 'save' },
      active: { type: Boolean, default: false },
      id: { type: String, default: '' },
      key: { type: String, default: '' },
      user: { type: String, default: 'waterland15' },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    tmdb: {
      filePath: { type: String, default: 'nodejs/tmdb' },
      functionName: { type: String, default: 'getConfig' },
      active: { type: Boolean, default: false },
      key: { type: String, default: '' },
      schedule: { type: String, default: '20 0 0 */3 * *' },
    },
    states: {
      visited: { type: [] },
      active: { type: Boolean, default: false },
    },
    countries: {
      visited: { type: [] },
      active: { type: Boolean, default: false },
    },
    apiKeys: {
      keys: { type: [] },
      active: { type: Boolean, default: false },
    },
    fuelly: {
      vehicles: {
        type: [],
        default: [
          {
            name: '',
            url: '',
          },
        ],
      },
      filePath: { type: String, default: 'nodejs/fuelly' },
      functionName: { type: String, default: 'save' },
      active: { type: Boolean, default: false },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    playerFm: {
      user: { type: String, default: 'waterland15' },
      filePath: { type: String, default: 'nodejs/player-fm' },
      functionName: { type: String, default: 'save' },
      active: { type: Boolean, default: false },
      schedule: { type: String, default: '45 0 0 * * *' },
    },
    feedly: {
      opml: { type: String, default: '' }, // https://feedly.com/i/opml
      filePath: { type: String, default: 'nodejs/feedly' },
      functionName: { type: String, default: 'save' },
      active: { type: Boolean, default: false },
      schedule: { type: String, default: '50 0 0 * * *' },
    },
  },
  { timestamps: true }, // Save createdAt and updatedAt fields
  { minimize: false }, // Save empty objects
  { strict: true } // Save only fields defined in the schema
);

module.exports = mongoose.model('appconfig', appConfigSchema);
