require('https').globalAgent.options.ca = require('ssl-root-cas').create(); // https://stackoverflow.com/a/32440021
const sgMail = require('@sendgrid/mail');

const logger = require('./log');
const secrets = require('../config/secrets');

sgMail.setApiKey(secrets.sendgrid.apiKey);

// Required Fields: to, subject, html (body)
exports.send = (mailOptions) => {
  const body = mailOptions.html;

  if (typeof body !== 'string' || !(body instanceof String)) {
    try {
      if (body instanceof Error) {
        // JSON.stringify() errors outputs an empty object so we need to handle errors seperately
        // eslint-disable-next-line no-param-reassign
        mailOptions.html = JSON.stringify(body, ['message', 'arguments', 'type', 'name']);
      } else {
        // eslint-disable-next-line no-param-reassign
        mailOptions.html = JSON.stringify(body);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  // Email defaults from config
  if (!mailOptions.to) {
    // eslint-disable-next-line no-param-reassign
    mailOptions.to = secrets.defaults.emailTo;
  }

  // eslint-disable-next-line no-param-reassign
  mailOptions.from = {
    email: mailOptions.from || secrets.defaults.emailFrom,
    name: secrets.defaults.emailFromName,
  };

  return sgMail.send(mailOptions).then((info) => {
    logger.debug(`Email sent. Message: ${info.message}`);
  });
};
