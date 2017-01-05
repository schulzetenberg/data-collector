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

  db: process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://localhost:27017/data-collector',

  sessionSecret: process.env.SESSION_SECRET || 'SecretsAreFun',

  sendgrid: {
    user: process.env.SENDGRID_USER || 'SGlogin',
    password: process.env.SENDGRID_PASSWORD || 'SGpassword'
  },

  lastFmKey: process.env.LASTFM_API_KEY || 'LfmKey',

  goodreadsID: process.env.GOODREADS_ID || '41826442',

  goodreadsKey: process.env.GOODREADS_API_KEY || 'GRkey',

  githubUser: process.env.GITHUB_USER || 'schulzetenberg',

  githubToken: process.env.GITHUB_TOKEN || 'GHtoken',

  traktID: process.env.TRAKT_ID || 'TraktID',

  traktSecret: process.env.TRAKT_SECRET || 'TraktSecret',

  tmdbKey: process.env.TMDB_KEY || 'TMDBKey'

};
