var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

//Load config file
var config = require('../config.json');

router.get('/', function (req, res) {
	req.flash('info', 'info');
	req.flash('error', 'error');
	req.flash('warning', 'warning');
	req.flash('success', 'success');
    res.render('pages/index.html', {config : config, title: config.web.siteTitle, user : req.user});
});

router.get('/register', function(req, res) {
    res.render('pages/register.html', {config : config, title: "Register | " + config.web.siteTitle});
});

router.post('/register', function(req, res, next) {
    Account.register(new Account({username : req.body.username}), req.body.password, function(err, account) {
        if (err) {
          return res.render("pages/register.html", {config : config, title: "Register | " + config.web.siteTitle, info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/login', function(req, res) {
    res.render('pages/login.html', {config : config, title: "Login | " + config.web.siteTitle, user : req.user});
});

router.post('/login', passport.authenticate('local'), function(req, res, next) {
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.save(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

router.get('/profile', function(req, res){
    res.render('pages/profile.html', {config : config, title: "Profile | " + config.web.siteTitle, user : req.user});
});

module.exports = router;
