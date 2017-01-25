module.exports = require('mongoose').model('fuelly', {
  timestamp : { type: Date, default: Date.now }, // Keep documents forever
  fillTime: Date,
  miles: Number,
  gallons: Number,
  price: Number,
  name: String
});
