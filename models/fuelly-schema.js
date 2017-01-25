module.exports = require('mongoose').model('fuelly', {
  timestamp : { type: Date, default: Date.now }, // Keep documents forever
  fillTime: {
    type: Date,
    index: { unique: true },
    dropDups: true
  },
  miles: Number,
  gallons: Number,
  price: Number,
  name: String
});
