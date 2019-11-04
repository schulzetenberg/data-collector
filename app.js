/**
 * Module dependencies.
 */
const express = require('express');
const lessMiddleware = require('less-middleware');
const cookieParser = require('cookie-parser');
const compress = require('compression');
const favicon = require('serve-favicon');
const session = require('express-session');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const passport = require('passport');
const expressValidator = require('express-validator');
const assets = require('express-asset-versions');

/**
 * Logging configuration
 */
const logger = require('./nodejs/log.js');

/**
 * Controllers (route handlers).
 */
// const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const settingsController = require('./controllers/settings');
const appConfigController = require('./controllers/app-config');
const contactController = require('./controllers/contact');
const apiController = require('./controllers/api');
const bruteforceController = require('./controllers/brute-force');

/**
 * API keys and configuration.
 */
const secrets = require('./config/secrets');
const passportConf = require('./config/passport');
const webConfig = require('./config/web');

/**
 * Development options
 */
let cookieOpts = {
  httpOnly: false,
  secure: false,
}; // Unsecure cookies
let publicOpts = {
  maxAge: 0,
}; // No cached content
let lessDebug = true;
let lessCompileOnce = true;

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
require('./nodejs/db');

/**
 * Express configuration.
 */
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
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
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
  lessDebug = false;
  lessCompileOnce = false;
}

app.use(
  lessMiddleware(path.join(__dirname, 'build', 'less'), {
    dest: path.join(__dirname, 'public'),
    once: lessCompileOnce,
    debug: lessDebug,
  })
);
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
app.use(assets('', path.join(__dirname, 'public'))); // Append checksum to files
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

const env = process.env.NODE_ENV || 'local';
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.user = req.user;
  res.locals.config = webConfig;
  res.locals.env = env;
  next();
});

// Remember me on login page
app.use((req, res, next) => {
  if (req.method === 'POST' && req.url === '/login') {
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = 2592000000; // Remember for 30 days
    } else {
      req.session.cookie.expires = false; // Else, cookie expires at end of session
    }
  }
  next();
});

const scheduler = require('./nodejs/scheduler');

scheduler.run();
const init = require('./nodejs/init');

/**
 * Primary app routes.
 */
// app.get('/', homeController.index); // Default home page
app.get('/', passportConf.isAuthenticated, appConfigController.getConfigPage);
app.get('/app-config', passportConf.isAuthenticated, appConfigController.getConfigPage);
app.get('/app-config/config', passportConf.isAuthenticated, appConfigController.getConfig);
app.post('/app-config/config', passportConf.isAuthenticated, appConfigController.saveConfig);
app.post('/app-config/run-app', passportConf.isAuthenticated, appConfigController.runApp);
app.get('/app-config/scheduler', passportConf.isAuthenticated, (req, res) => {
  scheduler.run();
  res.sendStatus(200);
});
app.get('/app-config/init', passportConf.isAuthenticated, (req, res) => {
  init.run();
  res.sendStatus(200);
});

app.get('/settings', passportConf.isAuthenticated, settingsController.getSettings);

app.get('/login', userController.getLogin);
app.post(
  '/login',
  bruteforceController.globalBruteforce.prevent,
  bruteforceController.userBruteforce.getMiddleware({
    key(req, res, next) {
      next(req.body.email);
    },
  }),
  userController.postLogin
);
app.get('/logout', userController.logout);
app.get('/forgot', userController.getForgot);
app.post('/forgot', userController.postForgot);
app.get('/reset/:token', userController.getReset);
app.post('/reset/:token', userController.postReset);
app.get('/signup', userController.getSignup);
app.post('/signup', userController.postSignup);

app.get('/contact', contactController.getContact);
app.post('/contact', contactController.postContact);

app.get('/account', passportConf.isAuthenticated, userController.getAccount);
app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);

app.get('/api/music', apiController.getMusic);
app.get('/api/goodreads', apiController.getGoodreads);
app.get('/api/github', apiController.getGithub);
app.get('/api/trakt', apiController.getTrakt);
app.get('/api/states', apiController.getStates);
app.get('/api/countries', apiController.getCountries);
app.get('/api/fuelly', apiController.getFuelly);
app.get('/api/fuelly-avg', apiController.getFuellyAvg);
app.get('/api/player-fm', apiController.getPlayerFm);

// Testing
app.get('/404', (req, res) => {
  res.render('404.html', {
    title: '404',
  });
});
app.get('/500', (req, res) => {
  res.render('500.html', {
    message: 'Test Error!',
    error: {},
    title: '500',
  });
});

if (app.get('env') === 'production') {
  // catch 404 and forward to error handler
  app.use((req, res) => {
    if (req.accepts('html')) {
      res.render('404.html', {
        title: '404',
      }); // Respond with HTML
    } else if (req.accepts('json')) {
      res.send({
        error: 'Not found',
      }); // Respond with JSON
    } else {
      res.type('txt').send('Not found'); // Fall back to plain text
    }
  });

  // production error handler, no stacktraces shown
  app.use((err, req, res, next) => {
    logger.error(`500 error: ${err}`);

    res.status(err.status || 500);

    if (req.accepts('html')) {
      // Respond with HTML
      res.render('500.html', {
        message: err.message,
        error: {},
        title: '500',
      });
    } else if (req.accepts('json')) {
      res.send({
        error: 'Internal Server Error',
      }); // Respond with JSON
    } else {
      res.type('txt').send('Internal Server Error'); // Fall back to plain text
    }
  });
} else {
  app.use(errorHandler()); // Display stack trace in dev
}

module.exports = app;
