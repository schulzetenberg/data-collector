const mongoose = require('mongoose');

const appConfigSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    github: {
      active: { type: Boolean, default: false },
      user: { type: String, default: '' },
      token: { type: String, default: '' },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    goodreads: {
      active: { type: Boolean, default: false },
      id: { type: Number, default: 0 },
      key: { type: String, default: '' },
      cloudinaryUpload: { type: Boolean, default: false },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    music: {
      active: { type: Boolean, default: false },
      lastFmKey: { type: String, default: '' },
      lastFmUsername: { type: String, default: '' },
      spotifyId: { type: String, default: '' },
      spotifySecret: { type: String, default: '' },
      cloudinaryUpload: { type: Boolean, default: false },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    trakt: {
      active: { type: Boolean, default: false },
      id: { type: String, default: '' },
      key: { type: String, default: '' },
      user: { type: String, default: '' },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    tmdb: {
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
            tableData: {
              index: Number,
            },
            name: '',
            url: '',
          },
        ],
      },
      active: { type: Boolean, default: false },
      schedule: { type: String, default: '5 0 0 * * *' },
    },
    playerFm: {
      user: { type: String, default: '' },
      active: { type: Boolean, default: false },
      cloudinaryUpload: { type: Boolean, default: false },
      schedule: { type: String, default: '45 0 0 * * *' },
    },
    feedly: {
      token: { type: String, default: '' }, // https://feedly.com/v3/auth/dev
      active: { type: Boolean, default: false },
      schedule: { type: String, default: '50 2 0 * * *' },
    },
    instagram: {
      user: { type: String, default: '' },
      active: { type: Boolean, default: false },
      schedule: { type: String, default: '55 1 0 * * *' },
      cloudinaryUpload: { type: Boolean, default: false },
    },
    parks: {
      active: { type: Boolean, default: false },
      schedule: { type: String, default: '10 10 0 * * 1' },
      cloudinaryUpload: { type: Boolean, default: false },
      visited: { type: [] },
    },
  },
  { timestamps: true }, // Save createdAt and updatedAt fields
  { minimize: false }, // Save empty objects
  { strict: true }, // Save only fields defined in the schema
  { setDefaultsOnInsert: true }
);

module.exports = mongoose.model('appconfig', appConfigSchema);
