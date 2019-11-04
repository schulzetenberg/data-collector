const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// const secrets = require('./secrets');
const User = require('../models/User');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Sign in using Email and Password.
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    const emailLowerCase = email.toLowerCase();

    User.findOne({ emailLowerCase }, (err, user) => {
      if (!user) return done(null, false, { message: `Email ${email} not found` });
      user.comparePassword(password, (err, isMatch) => {
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { message: 'Invalid email or password.' });
      });
    });
  })
);

// Login Required middleware.
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  req.session.returnTo = req.originalUrl; // Save requested URL
  res.redirect('/login');
};
