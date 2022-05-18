const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');
const response = require('../nodejs/response');
const logger = require('../nodejs/log');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Sign in using Email and Password
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user) => {
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

// Login Required middleware
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  response.loginRequired(res);
};

exports.validateApiToken = async (req, res, next) => {
  const errorMessage = 'Invalid API token';

  try {
    let userId = await User.findOne({ 'tokens.token': req.headers.token }, { _id: 1 });

    if (!userId) {
      if (!process.env.NODE_ENV === 'development') {
        return response.serverError(res, errorMessage);
      }

      logger.warn(`${errorMessage}: disabled in dev mode`);
      userId = '5e4c9b10231dc32fa0870be7';
    }

    // Append the userId to the request to be used in the API route handlers
    req.userId = userId;
    next();
  } catch (e) {
    logger.error(e);
    response.serverError(res, errorMessage);
  }
};
