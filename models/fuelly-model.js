const mongoose = require('mongoose');

module.exports = mongoose.model('fuelly', {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  timestamp: { type: Date, default: Date.now }, // Keep documents forever
  fillTime: Date,
  miles: Number,
  gallons: Number,
  price: Number,
  name: String,
});
