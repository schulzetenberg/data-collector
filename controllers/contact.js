const nodemailer = require('nodemailer');

const secrets = require('../config/secrets');

const transporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: secrets.sendgrid.user,
    pass: secrets.sendgrid.password,
  },
});

/**
 * GET /contact
 * Contact form page.
 */
exports.getContact = (req, res) => {
  res.render('contact.html', { title: 'Contact' });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash('error', errors);
    return res.redirect('/contact');
  }

  const from = req.body.email;
  //   const {name} = req.body;
  const body = req.body.message;
  const to = 'your@email.com';
  const subject = 'Contact Form | Hackathon Starter';

  const mailOptions = {
    to,
    from,
    subject,
    text: body,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      req.flash('error', { msg: err.message });
      return res.redirect('/contact');
    }

    req.flash('success', { msg: 'Email has been sent successfully!' });
    res.redirect('/contact');
  });
};
