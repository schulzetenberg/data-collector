var mongoose = require('mongoose');

var appConfigSchema = new mongoose.Schema({
  application1: {
    active: { type: Boolean, default: false },
    email: { type: String, default: null },
    threshold: { type: Number, default: 0 }
  },
  application2: {
    active: { type: Boolean, default: false },
    email: { type: String, default: null },
    threshold: { type: Number, default: 0 }
  },
  application3: {
    active: { type: Boolean, default: false },
    email: { type: String, default: null }
  }
  },
  { timestamps: true }, // Save createdAt and updatedAt fields
  { minimize: false } // Save empty objects
);

module.exports = mongoose.model('appconfig', appConfigSchema);
