// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoDB = require('./nodejs/mongoDB.js');

var routes = require('./routes/index');
var users = require('./routes/users');

// Connect to Mongo
mongoDB.start();

var app = express();
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');  
app.engine('html', require('ejs').renderFile);  //render html files as ejs

app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

var session = {
	    secret: 'keyboard cat',
	    resave: false,
	    saveUninitialized: false,
	    cookie: {}
	}

if (app.get('env') === 'production') {
	// Secure cookies
	app.set('trust proxy', 1) // trust first proxy
	session.cookie.secure = true // serve secure cookies
	}

app.use(require('express-session')(session)); 
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('pages/error.html', {
            message: err.message,
            error: err
        });
    });
}

// production error handler,  no stacktraces shown
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('pages/error.html', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
