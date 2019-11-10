// Module dependencies
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

// Logging configuration
const logger = require('./nodejs/log.js');

// API keys and configuration.
const secrets = require('./config/secrets');
const webConfig = require('./config/web');

// Development options
let cookieOpts = {
  httpOnly: false,
  secure: false,
}; // Unsecure cookies
let publicOpts = {
  maxAge: 0,
}; // No cached content
let lessDebug = true;
let lessCompileOnce = true;

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
app.use('/react', express.static(path.join(__dirname, 'frontend/build'), publicOpts));
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

const scheduler = require('./nodejs/scheduler');
scheduler.run();

// App routes
require('./routes')(app);

// Used for testing
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
			// Respond with JSON
      res.send({
        error: 'Internal Server Error',
      });
    } else {
			// Fall back to plain text
      res.type('txt').send('Internal Server Error');
    }
  });
} else {
  app.use(errorHandler()); // Display stack trace in dev
}

module.exports = app;
