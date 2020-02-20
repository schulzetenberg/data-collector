const crypto = require('crypto');
const passport = require('passport');
const moment = require('moment');

const logger = require('../nodejs/log');
const email = require('../nodejs/email');
const User = require('../models/User');
const AppConfig = require('../models/app-config');
const response = require('../nodejs/response');

exports.postSignin = (req, res, next) => {
  req.assert('email', 'Email address is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) return response.userError(res, errors);

  return passport.authenticate('local', async (err, user, info) => {
    if (err) {
      logger.error(err);
      return response.serverError(res, 'Error authenticating user');
    }

    if (!user) {
      return response.userError(res, info.message);
    }

    // TODO: Test this
    if (req.body.remember) {
      req.session.cookie.maxAge = 2592000000; // Remember for 30 days
    } else {
      req.session.cookie.expires = false; // Else, cookie expires at end of session
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        logger.error(loginErr);
        return response.serverError(res, 'Error logging in user');
      }

      // Reset the failure counter for this user
      req.brute.reset(() => {
        const data = { firstName: user.firstName, lastName: user.lastName, email: user.email };
        response.success(res, { data });
      });
    });
  })(req, res, next);
};

// Log out
exports.logout = (req, res) => {
  req.logout();
  response.success(res);
};

// Create a new local account
// eslint-disable-next-line no-unused-vars
exports.postSignup = async (req, res, next) => {
  req.assert('email', 'Email address is not valid').isEmail();
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  // Allow only one account (For now)
  // req.assert('email', 'Only admin@1.com is allowed').equals('admin@1.com');

  const errors = req.validationErrors();

  if (errors) {
    return response.userError(res, errors);
  }

  const user = new User({
    profile: { name: req.body.name },
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return response.userError(res, 'Account with that email address already exists');
    }
  } catch (e) {
    logger.error(e);
    return response.serverError(res, 'Error performing user lookup');
  }

  try {
    await user.save().then((savedUser) => {
      // eslint-disable-next-line no-underscore-dangle
      const configDoc = new AppConfig({ userId: savedUser._id });
      return configDoc.save();
    });
  } catch (e) {
    logger.error(e);
    return response.serverError(res, 'Error creating new user');
  }

  req.logIn(user, (err) => {
    if (err) {
      logger.error(err);
      return response.serverError(res, 'Error logging in user');
    }

    const data = { firstName: user.firstName, lastName: user.lastName, email: user.email };
    response.success(res, { data });
  });
};

exports.getProfile = (req, res) => {
  // We dont want to expose private user data such as the password hash
  const data = {
    firstName: req.user.firstName,
    lastName: req.user.lastName,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
    email: req.user.email,
    gravatar: req.user.gravatar(),
    tokens: req.user.tokens,
  };

  response.success(res, { data });
};

// Update profile information
exports.postUpdateProfile = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) return next(err);
    // eslint-disable-next-line no-param-reassign
    user.email = req.body.email || '';
    // eslint-disable-next-line no-param-reassign
    user.firstName = req.body.firstName || '';
    // eslint-disable-next-line no-param-reassign
    user.lastName = req.body.lastName || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          return response.userError(res, 'email address already in use');
        }

        logger.error(err);
        return response.serverError(res, 'Error saving profile updates');
      }

      response.success(res, { user });
    });
  });
};

// Update current password
// eslint-disable-next-line no-unused-vars
exports.postUpdatePassword = (req, res, next) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    return response.userError(res, errors);
  }

  User.findById(req.user.id, (err, user) => {
    if (err) {
      logger.error(err);
      return response.serverError(res, 'Error finding user profile');
    }

    // eslint-disable-next-line no-param-reassign
    user.password = req.body.password;

    user.save((err) => {
      if (err) {
        logger.error(err);
        return response.serverError(res, 'Error saving updated password');
      }

      response.success(res);
    });
  });
};

// Delete the user account
// eslint-disable-next-line no-unused-vars
exports.postDeleteAccount = (req, res, next) => {
  User.remove({ _id: req.user.id }, (err) => {
    if (err) {
      logger.error(err);
      return response.serverError(res, 'Error deleting account');
    }

    req.logout();
    res.redirect('/');
  });
};

// Process the reset password request
exports.postReset = async (req, res) => {
  req.assert('password', 'Password must be at least 4 characters long').len(4);
  req.assert('confirmPassword', 'Passwords must match').equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    return response.userError(res, errors);
  }

  let user;

  try {
    user = await User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
  } catch (e) {
    logger.error('Error finding user', e);
    return response.serverError(res, 'Error finding user');
  }

  if (!user) {
    return response.userError(res, 'Password reset token is invalid or has expired');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  try {
    await user.save();
  } catch (e) {
    logger.error('Error saving password reset', e);
    return response.serverError(res, 'Error saving password reset');
  }

  req.logIn(user, async (err) => {
    if (err) {
      logger.error('Error logging in user', err);
    }

    const mailOptions = {
      to: user.email,
      subject: 'Your Data Collector password has been changed',
      html: `
				Hello,
				<br /><br />
				This is a confirmation that the password for your account ${user.email} has just been changed.
				<br />
			`,
    };

    try {
      await email.send(mailOptions);
    } catch (e) {
      logger.error('Error sending password change email', e);
      return response.serverError(res, 'Error sending password change email');
    }

    const data = { firstName: user.firstName, lastName: user.lastName, email: user.email };
    response.success(res, { data });
  });
};

// Create a random token, then send the user an email with a reset link
exports.postForgot = async (req, res) => {
  req.assert('email', 'Please enter a valid email address').isEmail();

  const errors = req.validationErrors();

  if (errors) {
    return response.userError(res, errors);
  }

  let token;
  let user;

  try {
    token = await crypto.randomBytes(16).toString('hex');
  } catch (e) {
    logger.error(e);
    return response.serverError(res, 'Error generating token');
  }

  try {
    user = await User.findOne({ email: req.body.email.toLowerCase() });
  } catch (e) {
    return response.serverError(res, 'Error finding user');
  }

  if (!user) {
    return response.userError(res, 'No account with that email address found');
  }

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

  try {
    await user.save();
  } catch (e) {
    logger.error(e);
    return response.serverError(res, 'Error saving reset token');
  }

  const mailOptions = {
    to: user.email,
    subject: 'Reset your password on Data Collector',
    html: `
			You are receiving this email because you (or someone else) have requested a password reset for your account.
			<br /><br />
			Please click on the following link, or paste the link into your browser to complete the process:
			<br /><br />
			http://${req.headers.host}/reset-password/${token}
			<br /><br />
			This link expires in one hour. If you did not request a password reset, please ignore this email and your password will remain unchanged.
			<br />
		`,
  };

  try {
    await email.send(mailOptions);
  } catch (e) {
    logger.error(e);
    return response.serverError(res, 'Error sending email reset token');
  }

  response.success(res);
};

// Create a 16 digit unique key
exports.getNewApiKey = async (req, res) => {
  try {
    const token = await crypto.randomBytes(16).toString('hex');

    const newData = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $push: { tokens: [{ token, createdAt: moment() }] } },
      { new: true }
    );

    // eslint-disable-next-line no-underscore-dangle
    response.success(res, { data: newData._doc.tokens });
  } catch (e) {
    logger.error(e);
    return response.serverError(res, 'Error generating token');
  }
};
