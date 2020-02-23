// Module dependencies
const express = require('express');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const favicon = require('serve-favicon');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
const assets = require('express-asset-versions');
const Agendash = require('agendash');
const cors = require('cors');

// Logging configuration
const logger = require('./nodejs/log.js');

// API keys and configuration.
const secrets = require('./config/secrets');
const response = require('./nodejs/response');

// Development options
let cookieOpts = {
  httpOnly: false,
  secure: false,
}; // Unsecure cookies
let publicOpts = {
  maxAge: 0,
}; // No cached content

const app = express();
require('./nodejs/db');

// Express configuration
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(compress());
app.use(
  morgan('dev', {
    skip(req, res) {
      return res.statusCode < 400;
    }, // log only HTTP request errors
  })
);
app.use(favicon(path.join(__dirname, 'frontend/build', 'favicon.png')));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());

// Disable CORS
app.use(cors());
app.options('*', cors()); // Enable CORS Pre-Flight (Since I have custom headers for the token)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, x-xsrf-token');
  next();
});

function requireHTTPS(req, res, next) {
  if (!req.secure) {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }
  next();
}

if (app.get('env') === 'production') {
  publicOpts = {
    maxAge: 86400000,
  }; // Max age of 1 day for static content
  app.set('trust proxy', 1); // trust first proxy
  app.use(requireHTTPS); // HTTPS redirection
  cookieOpts = {
    httpOnly: true,
    secure: true,
  }; // Secure cookies
}

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: secrets.sessionSecret,
    store: new MongoStore({
      url: secrets.db,
      autoReconnect: true,
    }),
    cookie: cookieOpts,
  })
);
app.use(express.static(path.join(__dirname, 'public'), publicOpts));
app.use('/', express.static(path.join(__dirname, 'frontend/build'), publicOpts));
app.use(assets('', path.join(__dirname, 'public'))); // Append checksum to files
app.use(passport.initialize());
app.use(passport.session());

// App routes
require('./routes')(app);

// Agenda scheduler
const { agenda } = require('./nodejs/agenda');

// Agenda UI Dashboard
app.use(
  '/agenda',
  (req, res, next) => {
    if (!req.user) {
      res.send(401);
    } else {
      next();
    }
  },
  Agendash(agenda)
);

if (app.get('env') === 'production') {
  // production error handler, no stacktraces shown
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    logger.error(`500 error: ${err}`);
    res.status(err.status || 500);
    res.send({ error: 'Internal Server Error' });
  });
} else {
  app.use(errorHandler()); // Display stack trace in dev
}

app.post('*', (req, res) => {
  response.notFound(res, `Path "${req.path}" not found`);
});

module.exports = app;
