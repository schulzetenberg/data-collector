var mongoose = require('mongoose');

var appConfigSchema = new mongoose.Schema({
  github: {
    filePath: { type: String, default: '' },
    functionName: { type: String, default: '' },
    active: { type: Boolean, default: false },
    user: { type: String, default: '' },
    token: { type: String, default: '' },
    schedule: { type: String, default: '' }
  },
  goodreads: {
    filePath: { type: String, default: '' },
    functionName: { type: String, default: '' },
    active: { type: Boolean, default: false },
    numDays: { type: Number, default: 0 },
    id: { type: Number, default: 0 },
    key: { type: String, default: '' },
    schedule: { type: String, default: '' }
  },
  lastFm: {
    filePath: { type: String, default: '' },
    functionName: { type: String, default: '' },
    active: { type: Boolean, default: false },
    key: { type: String, default: '' },
    schedule: { type: String, default: '' }
  },
  trakt: {
    filePath: { type: String, default: '' },
    functionName: { type: String, default: '' },
    active: { type: Boolean, default: false },
    id: { type: String, default: '' },
    key: { type: String, default: '' },
    user: { type: String, default: '' },
    schedule: { type: String, default: '' }
  },
  tmdb: {
    filePath: { type: String, default: '' },
    functionName: { type: String, default: '' },
    active: { type: Boolean, default: false },
    key: { type: String, default: '' },
    schedule: { type: String, default: '' }
  },
  states: {
    visited: { type: [] },
    lived: { type: [] }
  }
  },
  { timestamps: true }, // Save createdAt and updatedAt fields
  { minimize: false }, // Save empty objects
  { strict: true } // Save only fields defined in the schema
);

module.exports = mongoose.model('appconfig', appConfigSchema);
