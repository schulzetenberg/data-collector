const cheerio = require('cheerio');
const chai = require('chai');

const should = chai.should();
const User = require('../models/User');
const Session = require('supertest-session')({
  app: require('../app.js'),
});

function extractCsrfToken(res) {
  const $ = cheerio.load(res.text);
  return $('[name=_csrf]').val();
}

// Remove test user (if exists)
before((done) => {
  User.remove({ email: 'testing@1.com' }, (err) => {
    if (err) return done(err);
    done();
  });
});
// Remove delete user (if exists)
before((done) => {
  User.remove({ email: 'testing@2.com' }, (err) => {
    if (err) return done(err);
    done();
  });
});
// Remove updated user (if exists)
before((done) => {
  User.remove({ email: 'testing-new@1.com' }, (err) => {
    if (err) return done(err);
    done();
  });
});

describe('GET: user not logged in', () => {
  let session;

  beforeEach(() => {
    session = new Session();
  });

  describe('GET /', () => {
    it('should return 200 OK', (done) => {
      session.get('/').expect(200, done);
    });
  });

  describe('GET /random-url', () => {
    it('should return 404', (done) => {
      session.get('/reset').expect(404, done);
    });
  });

  describe('GET /forgot', () => {
    it('should return 200 OK', (done) => {
      session.get('/forgot').expect(200, done);
    });
  });

  describe('GET /account', () => {
    it('should return 302 redirect to /login', (done) => {
      session.get('/account').expect(302).expect('Location', '/login').end(done);
    });
  });

  describe('GET /reset/:token', () => {
    it('should return 302 redirect to /forgot', (done) => {
      session.get('/reset/123').expect(302).expect('Location', '/forgot').end(done);
    });
  });

  describe('GET /logout', () => {
    it('should return 302 redirect to /', (done) => {
      session.get('/logout').expect(302).expect('Location', '/').end(done);
    });
  });
});

describe('POST /signup', () => {
  let session;

  beforeEach(() => {
    session = new Session();
  });

  describe('CSRF token is invalid', () => {
    it('should be unauthorized', (done) => {
      session
        .post('/signup')
        .send({
          name: 'Tester',
          email: 'testing@1.com',
          password: '123456',
          confirmPassword: '123456',
          _csrf: '123',
        })
        .expect(403)
        .end(done);
    });
  });

  describe('when valid CSRF token is provided', () => {
    let csrfToken;

    beforeEach((done) => {
      session.get('/signup').end((err, res) => {
        if (err) return done(err);
        csrfToken = extractCsrfToken(res);
        done();
      });
    });

    it('should accept the result', (done) => {
      session
        .post('/signup')
        .send({
          name: 'Tester',
          email: 'testing@1.com',
          password: '123456',
          confirmPassword: '123456',
          _csrf: csrfToken,
        })
        .expect(302)
        .expect('Location', '/')
        .end(done);
    });
  });
});

describe('POST /account/delete', () => {
  let session;
  let csrfToken;

  before((done) => {
    session = new Session();
    session.get('/signup').end((err, res) => {
      if (err) return done(err);
      csrfToken = extractCsrfToken(res);
      done();
    });
  });
  before((done) => {
    session
      .post('/signup')
      .send({
        name: 'Tester 2',
        email: 'testing@2.com',
        password: '123456',
        confirmPassword: '123456',
        _csrf: csrfToken,
      })
      .expect(302)
      .expect('Location', '/')
      .end(done);
  });
  before((done) => {
    session.get('/account').end((err, res) => {
      if (err) return done(err);
      csrfToken = extractCsrfToken(res);
      done();
    });
  });

  describe('POST /account/delete', () => {
    it('should return 200 OK', (done) => {
      session.post('/account/delete').expect(302).expect('Location', '/').send({ _csrf: csrfToken }).end(done);
    });

    it('should not find user in DB', (done) => {
      User.findOne({ email: 'testing@2.com' }, (err, user) => {
        if (err) return done(err);
        should.not.exist(user);
        done();
      });
    });
  });
});

describe('POST /login', () => {
  let session;

  beforeEach(() => {
    session = new Session();
  });

  describe('CSRF token is invalid', () => {
    it('should be unauthorized', (done) => {
      session
        .post('/login')
        .send({
          name: 'Tester',
          email: 'testing@1.com',
          password: '123456',
          confirmPassword: '123456',
          _csrf: '123',
        })
        .expect(403)
        .end(done);
    });
  });

  describe('when valid CSRF token is provided', () => {
    let csrfToken;

    beforeEach((done) => {
      session.get('/login').end((err, res) => {
        if (err) return done(err);
        csrfToken = extractCsrfToken(res);
        done();
      });
    });

    it('should accept the result', (done) => {
      session
        .post('/login')
        .send({
          name: 'Tester',
          email: 'testing@1.com',
          password: '123456',
          confirmPassword: '123456',
          _csrf: csrfToken,
        })
        .expect(302)
        .expect('Location', '/')
        .end(done);
    });
  });
});

describe('GET: user logged in', () => {
  let session;
  let csrfToken;

  // Get the CSRF token then log in
  beforeEach((done) => {
    session = new Session();
    session.get('/login').end((err, res) => {
      if (err) return done(err);
      csrfToken = extractCsrfToken(res);
      session
        .post('/login')
        .send({
          name: 'Tester',
          email: 'testing@1.com',
          password: '123456',
          confirmPassword: '123456',
          _csrf: csrfToken,
        })
        .end(done);
    });
  });

  describe('GET /account', () => {
    it('should return 200 OK', (done) => {
      session.get('/account').expect(200).end(done);
    });
  });
});

describe('POST: user logged in', () => {
  let session;
  let csrfToken;

  // Get the CSRF token then log in
  beforeEach((done) => {
    session = new Session();
    session.get('/login').end((err, res) => {
      if (err) return done(err);
      csrfToken = extractCsrfToken(res);
      session
        .post('/login')
        .send({
          name: 'Tester',
          email: 'testing@1.com',
          password: '123456',
          confirmPassword: '123456',
          _csrf: csrfToken,
        })
        .end(done);
    });
  });

  describe('POST /account/profile', () => {
    it('should return 200 OK', (done) => {
      session
        .post('/account/profile')
        .expect(302)
        .expect('Location', '/account')
        .send({
          name: 'New Name',
          email: 'testing-new@1.com',
          location: 'Denver, CO',
          website: 'www.test.com',
          _csrf: csrfToken,
        })
        .end(done);
    });
    it('should find updated user info', (done) => {
      User.findOne({ email: 'testing-new@1.com' }, (err, user) => {
        if (err) return done(err);
        user.email.should.equal('testing-new@1.com');
        user.firstName.should.equal('New Name');
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
