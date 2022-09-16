const mongoose = require('mongoose');

const parksSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    parks: [
      {
        name: String,
        imageUrl: String,
        State: String,
        location: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('parks', parksSchema);
