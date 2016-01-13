var request = require('supertest');
var app = require('../app.js');
var cheerio = require('cheerio')
var chai = require('chai');
var should = chai.should();
var User = require('../models/User');
var Session = require('supertest-session')({
  app: require('../app.js')
});

function extractCsrfToken (res) {
  var $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
}

describe('GET /', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});

describe('GET /login', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/login')
      .expect(200, done);
  });
});

describe('GET /signup', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/signup')
      .expect(200, done);
  });
});

describe('GET /contact', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /random-url', function() {
  it('should return 404', function(done) {
    request(app)
      .get('/reset')
      .expect(404, done);
  });
});

describe('GET /forgot', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/forgot')
      .expect(200, done);
  });
});

describe('GET /contact', function() {
  it('should return 200 OK', function(done) {
    request(app)
      .get('/contact')
      .expect(200, done);
  });
});

describe('GET /account', function() {
  it('should return 302 redirect to /login', function(done) {
    request(app)
      .get('/account')
      .expect(302)
      .expect('Location', '/login')
      .end(done)
  });
});

describe('GET /reset/:token', function() {
  it('should return 302 redirect to /forgot', function(done) {
    request(app)
      .get('/reset/123')
      .expect(302)
      .expect('Location', '/forgot')
      .end(done)
  });
});

describe('GET /logout', function() {
  it('should return 302 redirect to /', function(done) {
    request(app)
      .get('/logout')
      .expect(302)
      .expect('Location', '/')
      .end(done)
  });
});

/*
** To write tests for:
*/
// POST /login
            // GET logout
// POST /forgot
            // app.get('/reset/:token', userController.getReset);
// app.post('/reset/:token', userController.postReset);
// app.post('/signup', userController.postSignup);
// app.post('/contact', contactController.postContact);
            // app.get('/account', passportConf.isAuthenticated, userController.getAccount);
// app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
// app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
// app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
