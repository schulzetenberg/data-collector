/**
 * Module dependencies.
 */
var express = require('express'),
  lessMiddleware = require('less-middleware'),
  cookieParser = require('cookie-parser'),
  compress = require('compression'),
  favicon = require('serve-favicon'),
  session = require('express-session'),
  bodyParser = require('body-parser'),
  logger = require('morgan'),
  errorHandler = require('errorhandler'),
  lusca = require('lusca'),
  methodOverride = require('method-override'),
  MongoStore = require('connect-mongo')(session),
  flash = require('express-flash'),
  path = require('path'),
  passport = require('passport'),
  expressValidator = require('express-validator');

/**
 * Controllers (route handlers).
 */
var homeController = require('./controllers/home'),
  userController = require('./controllers/user'),
  settingsController = require('./controllers/settings'),
  appConfigController = require('./controllers/app-config'),
  contactController = require('./controllers/contact'),
  apiController = require('./controllers/api'),
  bruteforceController = require('./controllers/brute-force');

/**
 * API keys and configuration.
 */
var secrets = require('./config/secrets'),
  passportConf = require('./config/passport'),
  config = require('./config.json');

/**
 * Development options
 */
var cookieOpts = { httpOnly: false, secure: false }, // Unsecure cookies
  publicOpts = { maxAge: 0 }, // No cached content
  lessDebug = true,
  lessCompileOnce = true;

/**
 * Create Express server.
 */
var app = express();

/**
 * Connect to MongoDB.
 */
require('./nodejs/db.js');

/**
 * Express configuration.
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);  //render html files as ejs
app.use(compress());
app.use(logger('dev', {
  skip: function (req, res) { return res.statusCode < 400 } // log only HTTP request errors
}));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());

function requireHTTPS(req, res, next) {
  if (!req.secure) {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
}

if (app.get('env') === 'production') {
  publicOpts = { maxAge: 86400000 }; // Max age of 1 day for static content
  app.set('trust proxy', 1); // trust first proxy
  app.use(requireHTTPS);  // HTTPS redirection
  cookieOpts = { httpOnly: true, secure: true }; // secure cookies
  lessDebug = false;
  lessCompileOnce = false;
}

app.use(lessMiddleware(path.join(__dirname, 'build','less'), {
  dest: path.join(__dirname, 'public'),
  once: lessCompileOnce,
  debug: lessDebug
}));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, autoReconnect: true }),
  cookie: cookieOpts
}));
app.use(express.static(path.join(__dirname, 'public'), publicOpts));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca({
  csrf: {angular: true},
  xframe: 'SAMEORIGIN',
  xssProtection: true
}));
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.config = config; // TODO: Find better place for this
  next();
});

//Remember me on login page
app.use( function (req, res, next) {
  if ( req.method == 'POST' && req.url == '/login' ) {
    if ( req.body.rememberMe ) {
      req.session.cookie.maxAge = 2592000000; // Remember for 30 days
    } else {
      req.session.cookie.expires = false; // Else, cookie expires at end of session
    }
  }
  next();
});

var scheduler = require('./nodejs/scheduler');
scheduler.run();

/**
 * Primary app routes.
 */
app.get('/', homeController.index);

app.get('/app-config', appConfigController.getConfigPage);
app.get('/app-config/config', appConfigController.getConfig);
app.post('/app-config/config', appConfigController.saveConfig);
app.post('/app-config/run-app', appConfigController.runApp);
app.get('/app-config/scheduler', function(req, res){ scheduler.run(); res.sendStatus(200); });

app.get('/settings', settingsController.getSettings);

app.get('/login', userController.getLogin);
app.post('/login',
  bruteforceController.globalBruteforce.prevent,
  bruteforceController.userBruteforce.getMiddleware({key: function(req, res, next){ next(req.body.email); }}),
  userController.postLogin);
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

app.get('/api/lastFM', apiController.getLastFM);
app.get('/api/goodreads', apiController.getGoodreads);
app.get('/api/github', apiController.getGithub);
app.get('/api/trakt', apiController.getTrakt);

if (app.get('env') === 'production') {
  //catch 404 and forward to error handler
  app.use(function(req, res) {
    res.render('404.html',{title: "404"});
  });
  // production error handler,  no stacktraces shown
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('500.html', {
      message: err.message,
      error: {},
      title : "500"
    });
  });
} else {
  app.use(errorHandler()); // Display stack trace in dev
}

module.exports = app;
