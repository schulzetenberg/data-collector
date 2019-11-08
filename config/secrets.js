/*
 * Use config vars (environment variables) below for production API keys
 * and passwords. Each PaaS (e.g. Heroku, Nodejitsu, OpenShift, Azure) has a way
 * for you to set it up from the dashboard.
 *
 * Another added benefit of this approach is that you can use two different
 * sets of keys for local development and production mode without making any
 * changes to the code.
 */

module.exports = {

  ipAddress: process.env.IP_ADDRESS || '127.0.0.1',

  port: process.env.PORT || '3000',

  SSL: process.env.ssl || false,

  db: process.env.DB || 'mongodb://localhost:27017/data-collector',

  logLevel: process.env.LOG_LEVEL || 'debug',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  sendgrid: {
    apiKey: process.env.SENDGRID_APIKEY || 'apiKey123',
  },

  defaults: {
		emailTo: 'me@gmail.com',
		emailFrom: 'Data_Collector@me.com',
		emailFromName: 'Data Collector',
  }

};
