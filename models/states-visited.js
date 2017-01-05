module.exports = require('mongoose').model('states-visited', {
  timestamp : { type: Date, default: Date.now },
  states: [
    [
      {
        v: String,
        f: String
      },
      Number,
      String
    ]
  ]
});
