var mongoose = require('mongoose');

var appConfigSchema = new mongoose.Schema({
  application1: {
    active: { type: Boolean, default: false },
    email: { type: String, default: '' },
    threshold: { type: Number, default: 0 },
    schedule: { type: String, default: '' }
  },
  application2: {
    active: { type: Boolean, default: false },
    email: { type: String, default: '' },
    threshold: { type: Number, default: 0 },
    schedule: { type: String, default: '' }
  },
  application3: {
    active: { type: Boolean, default: false },
    email: { type: String, default: '' },
    schedule: { type: String, default: '' },
    users: {type: Array , default: []}
  }
  },
  { timestamps: true }, // Save createdAt and updatedAt fields
  { minimize: false }, // Save empty objects
  { strict: true } // Save only fields defined in the schema
);

module.exports = mongoose.model('appconfig', appConfigSchema);
