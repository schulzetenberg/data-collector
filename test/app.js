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

// Remove test user (if exists)
before(function(done) {
  User.remove({ email: 'testing@1.com' }, function(err) {
    if (err) return done(err);
    done();
  });
});
// Remove delete user (if exists)
before(function(done) {
  User.remove({ email: 'testing@2.com' }, function(err) {
    if (err) return done(err);
    done();
  });
});
// Remove updated user (if exists)
before(function(done) {
  User.remove({ email: 'testing-new@1.com' }, function(err) {
    if (err) return done(err);
    done();
  });
});

describe('Contact page', function () {
  var session;
  var csrfToken;

  beforeEach(function (done) {
    session = new Session();
    session.get('/contact')
    .end(function (err, res) {
      if (err) return done(err);
      csrfToken = extractCsrfToken(res);
      done();
    });
  });

  describe('POST /contact', function () {
    it('should be unauthorized', function (done) {
      session
        .post('/contact')
        .send({
          name:"Tester",
          email:"testing@1.com",
          body:"Test body.",
          _csrf: csrfToken })
        .expect(302)
        .expect('Location', '/contact')
        .end(done)
    });
  });
});

describe('GET: user not logged in', function () {

  var session;

  beforeEach(function () {
    session = new Session();
  });

  describe('GET /', function() {
    it('should return 200 OK', function(done) {
      session
        .get('/')
        .expect(200, done);
    });
  });

  describe('GET /random-url', function() {
    it('should return 404', function(done) {
      session
        .get('/reset')
        .expect(404, done);
    });
  });

  describe('GET /forgot', function() {
    it('should return 200 OK', function(done) {
      session
        .get('/forgot')
        .expect(200, done);
    });
  });

  describe('GET /contact', function() {
    it('should return 200 OK', function(done) {
      session
        .get('/contact')
        .expect(200, done);
    });
  });

  describe('GET /account', function() {
    it('should return 302 redirect to /login', function(done) {
      session
        .get('/account')
        .expect(302)
        .expect('Location', '/login')
        .end(done)
    });
  });

  describe('GET /reset/:token', function() {
    it('should return 302 redirect to /forgot', function(done) {
      session
        .get('/reset/123')
        .expect(302)
        .expect('Location', '/forgot')
        .end(done)
    });
  });

  describe('GET /logout', function() {
    it('should return 302 redirect to /', function(done) {
      session
        .get('/logout')
        .expect(302)
        .expect('Location', '/')
        .end(done)
    });
  });
});

describe('POST /signup', function () {

  var session;

  beforeEach(function () {
    session = new Session();
  });

  describe('CSRF token is invalid', function () {
    it('should be unauthorized', function (done) {
      session
        .post('/signup')
        .send({
            name:"Tester",
            email:"testing@1.com",
            password:"123456",
            confirmPassword:"123456",
            _csrf: "123" })
        .expect(403)
        .end(done)
    });
  });

  describe('when valid CSRF token is provided', function () {
    var csrfToken;

  beforeEach(function (done) {
    session.get('/signup')
      .end(function (err, res) {
        if (err) return done(err);
        csrfToken = extractCsrfToken(res);
        done();
    });
  });

  it('should accept the result', function (done) {
    session
      .post('/signup')
      .send({name:"Tester", email:"testing@1.com", password:"123456", confirmPassword:"123456", _csrf: csrfToken })
      .expect(302)
      .expect('Location', '/')
      .end(done)
  });

  });
});

describe('POST /account/delete', function () {

  var session;
  var csrfToken;

  before(function (done) {
    session = new Session();
    session.get('/signup')
      .end(function (err, res) {
        if (err) return done(err);
        csrfToken = extractCsrfToken(res);
        done();
      });
  });
  before(function (done) {
    session
      .post('/signup')
      .send({name:"Tester 2", email:"testing@2.com", password:"123456", confirmPassword:"123456", _csrf: csrfToken })
      .expect(302)
      .expect('Location', '/')
      .end(done)
  });
  before(function (done) {
      session.get('/account')
      .end(function (err, res) {
          if (err) return done(err);
          csrfToken = extractCsrfToken(res);
          done();
      });
  });

  describe('POST /account/delete', function() {
    it('should return 200 OK', function(done) {
        session
        .post('/account/delete')
        .expect(302)
        .expect('Location', '/')
        .send({ _csrf: csrfToken})
        .end(done);

    });

    it('should not find user in DB', function(done) {
        User.findOne({ email: 'testing@2.com' }, function(err, user) {
            if (err) return done(err);
            should.not.exist(user);
            done();
        });
    });
  });
});

describe('POST /login', function () {
  var session;

  beforeEach(function () {
    session = new Session();
  });

  describe('CSRF token is invalid', function () {
    it('should be unauthorized', function (done) {
      session
      .post('/login')
      .send({
        name:"Tester",
        email:"testing@1.com",
        password:"123456",
        confirmPassword:"123456",
        _csrf: "123" })
      .expect(403)
      .end(done)
    });
  });

  describe('when valid CSRF token is provided', function () {
    var csrfToken;

    beforeEach(function (done) {
      session.get('/login')
      .end(function (err, res) {
        if (err) return done(err);
        csrfToken = extractCsrfToken(res);
        done();
      });
    });

    it('should accept the result', function (done) {
      session
      .post('/login')
      .send({
        name:"Tester",
        email:"testing@1.com",
        password:"123456",
        confirmPassword:"123456",
        _csrf: csrfToken })
      .expect(302)
      .expect('Location', '/')
      .end(done)
    });

  });
});

describe('GET: user logged in', function () {
  var session;
  var csrfToken;

  // Get the CSRF token then log in
  beforeEach(function (done) {
    session = new Session();
    session.get('/login')
    .end(function (err, res) {
        if (err) return done(err);
        csrfToken = extractCsrfToken(res);
          session
          .post('/login')
          .send({
            name:"Tester",
            email:"testing@1.com",
            password:"123456",
            confirmPassword:"123456",
            _csrf: csrfToken })
            .end(done);
      });
  });

  describe('GET /account', function() {
    it('should return 200 OK', function(done) {
      session
      .get('/account')
      .expect(200)
      .end(done)
    });
  });

});

describe('POST: user logged in', function () {
  var session;
  var csrfToken;

  // Get the CSRF token then log in
  beforeEach(function (done) {
    session = new Session();
    session.get('/login')
    .end(function (err, res) {
      if (err) return done(err);
      csrfToken = extractCsrfToken(res);
        session
        .post('/login')
        .send({
          name:"Tester",
          email:"testing@1.com",
          password:"123456",
          confirmPassword:"123456",
          _csrf: csrfToken })
        .end(done);
      });
    });

  describe('POST /account/profile', function() {
    it('should return 200 OK', function(done) {
      session
      .post('/account/profile')
      .expect(302)
      .expect('Location', '/account')
      .send({
        name:"New Name",
        email:"testing-new@1.com",
        location:"Denver, CO",
        website:"www.test.com",
        _csrf: csrfToken })
        .end(done);

    });
    it('should find updated user info', function(done) {
      User.findOne({ email: 'testing-new@1.com' }, function(err, user) {
        if (err) return done(err);
        user.email.should.equal('testing-new@1.com');
        user.profile.name.should.equal('New Name');
        user.profile.location.should.equal('Denver, CO');
        user.profile.website.should.equal('www.test.com');
        done();
      });
    });
  });

});

/*
    To manually test:
    * Forgotten password email gets sent & able to reset password using email link.
    * Log out
    * Change password
*/

/*
    TODO:
    * Brute force tests
    * HTTPS redirection
*/
