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

  sslKeyPath: process.env.SSL_key_path || './key.pem',

  sslCertPath: process.env.SSL_cert_path || './cert.pem',

  MongoUrl: process.env.MongoUrl || 'mongodb://localhost:27017/',

  db: process.env.DB || 'data-collector',

  logLevel: process.env.LOG_LEVEL || 'debug',

  sessionSecret: process.env.SESSION_SECRET || 'Your Session Secret goes here',

  sendgrid: {
    apiKey: process.env.SENDGRID_APIKEY || 'apiKey123',
  },

  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'schulzetenberg',
    api_key: process.env.CLOUDINARY_API_KEY || 'apiKey123',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'apiSecret123',
  },

  defaults: {
    emailTo: 'me@gmail.com',
    emailFrom: 'Data_Collector@me.com',
    emailFromName: 'Data Collector',
  },
};
