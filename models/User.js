const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, lowercase: true },
    password: String,
    tokens: [{ token: String, createdAt: Date }],
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    picture: { type: String, default: '' }, // TODO: Use or delete this
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }, // createdAt and updatedAt
  { minimize: false }
);

/**
 * Password hash middleware.
 */
// eslint-disable-next-line func-names
userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

/**
 * Helper method for validating user's password.
 */
// eslint-disable-next-line func-names
userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/**
 * Helper method for getting user's gravatar.
 */
// eslint-disable-next-line func-names
userSchema.methods.gravatar = function(size) {
  if (!size) size = 200;
  if (!this.email) return `https://gravatar.com/avatar/?s=${size}&d=retro`;
  const md5 = crypto
    .createHash('md5')
    .update(this.email)
    .digest('hex');
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

module.exports = mongoose.model('User', userSchema);
