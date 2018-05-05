const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Q = require('q');

const logger = require('./log');
const secrets = require('../config/secrets');

// Configure Nodemailer SendGrid Transporter
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
       api_key: secrets.sendgrid.apiKey
     },
  })
);


// Required Fields: to, subject, html (body)
exports.send = function(mailOptions) {
  const defer = Q.defer();
  const body = mailOptions.html;

  if (typeof body === 'string' || body instanceof String) {
    // Do nothing
  } else {
    try {
     if (body instanceof Error) {
       // JSON.stringify() errors outputs an empty object so we need to handle errors seperately
       mailOptions.html = JSON.stringify(body, ['message', 'arguments', 'type', 'name']);
     } else {
       mailOptions.html = JSON.stringify(body);
     }
    } catch(err) {
     return defer.reject(err);
    }
  }

  // Email defaults from config
  if (!mailOptions.to) {
    mailOptions.to = secrets.defaults.emailTo;
  }

  if (!mailOptions.from) {
    mailOptions.from = secrets.defaults.emailFrom;
  }

  transporter.sendMail(mailOptions).then(function(info) {
    logger.info('Email sent. Message: ' + info.message);
    defer.resolve();
  }).catch(function(err) {
    defer.reject(err);
  });

  return defer.promise;
};
