const async = require('async');
const crypto = require('crypto');
const passport = require('passport');
const moment = require('moment');

const logger = require('../nodejs/log');
const email = require('../nodejs/email');
const User = require('../models/User');
const response = require('../nodejs/response');

// Login page
exports.getLogin = (req, res) => {
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('account/login.html', { title: 'Login' });
  }
};

/**
 * TODO: Delete after move to React
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert('email', 'Email address is not valid').isEmail();
  req.assert('password', 'Password cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    return res.redirect('/login');
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      // reset the failure counter so next time they log in they get 5 tries again before the delays kick in
      req.brute.reset(() => {
        res.redirect('/');
      });
    });
  })(req, res, next);
};

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

    req.logIn(user, (err) => {
      if (err) {
        logger.error(err);
        return response.serverError(res, 'Error logging in user');
      }

      // Reset the failure counter for this user
      req.brute.reset(() => {
        const data = { name: user.profile.name, email: user.email };
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

// Signup page
exports.getSignup = (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('account/signup.html', {
    title: 'Create Account',
  });
};

// Create a new local account
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
    await user.save();
  } catch (e) {
    logger.error(err);
    return response.serverError(res, 'Error saving new user');
  }

  req.logIn(user, (err) => {
    if (err) {
      logger.error(err);
      return response.serverError(res, 'Error logging in user');
    }

    const data = { name: user.profile.name, email: user.email };
    response.success(res, { data });
  });
};

// Profile page
exports.getAccount = (req, res) => {
  res.render('account/profile.html', {
    title: 'Account Management',
  });
};

exports.getProfile = (req, res) => {
  // We dont want to expose private user data such as the password hash
  const data = {
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt,
    email: req.user.email,
    gravatar: req.user.gravatar(),
    profile: { ...req.user.profile },
  };

  response.success(res, { data });
};

// Update profile information
exports.postUpdateProfile = (req, res, next) => {
  User.findById(req.user.id, (err, user) => {
    if (err) return next(err);
    user.email = req.body.email || '';
    user.profile.firstName = req.body.profile.firstName || '';
    user.profile.lastName = req.body.profile.lastName || '';

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          return response.userError(res, 'email address already in use');
        }

        logger.error(err);
        return response.serverError(res, 'Error saving profile updates');
      }

      response.success(res);
    });
  });
};

// Update current password
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

// Reset Password page
exports.getReset = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }

  User.findOne({ resetPasswordToken: req.params.token })
    .where('resetPasswordExpires')
    .gt(Date.now())
    .exec((err, user) => {
      if (!user) {
        req.flash('error', { msg: 'Password reset token is invalid or has expired' });
        return res.redirect('/forgot');
			}

      res.render('reset.html', {
        title: 'Password Reset',
      });
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

		const data = { name: user.profile.name, email: user.email };
		response.success(res, { data });
  });
};

// Forgot Password page
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('account/forgot.html', {
    title: 'Forgot Password',
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
    response.success(res, { token, createdAt: moment() });
  } catch (e) {
    logger.error(e);
    return response.serverError(res, 'Error generating token');
  }
};
