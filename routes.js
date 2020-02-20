const passportConf = require('./config/passport');

const response = require('./nodejs/response');

// Controllers
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const appConfigController = require('./controllers/app-config');
const apiController = require('./controllers/api');
const bruteforceController = require('./controllers/brute-force');

module.exports = (app) => {
  app.get('/app-config/config', passportConf.isAuthenticated, appConfigController.getConfig);
  app.post('/app-config/config', passportConf.isAuthenticated, appConfigController.saveConfig);
  app.post('/app-config/run-app', passportConf.isAuthenticated, appConfigController.runApp);

  app.post(
    '/signin',
    bruteforceController.globalBruteforce.prevent,
    bruteforceController.userBruteforce.getMiddleware({
      key(req, res, next) {
        next(req.body.email);
      },
    }),
    userController.postSignin
  );
  app.post('/logout', userController.logout);
  app.post('/forgot', userController.postForgot);
  app.post('/reset', userController.postReset);
  app.post('/signup', userController.postSignup);

  app.get('/account/profile', passportConf.isAuthenticated, userController.getProfile);
  app.post('/account/profile', passportConf.isAuthenticated, userController.postUpdateProfile);
  app.post('/account/password', passportConf.isAuthenticated, userController.postUpdatePassword);
  app.post('/account/delete', passportConf.isAuthenticated, userController.postDeleteAccount);
  app.get('/account/api-key', passportConf.isAuthenticated, userController.getNewApiKey);

  app.get('/api/music', apiController.getMusic);
  app.get('/api/goodreads', apiController.getGoodreads);
  app.get('/api/github', apiController.getGithub);
  app.get('/api/trakt', apiController.getTrakt);
  app.get('/api/states', apiController.getStates);
  app.get('/api/countries', apiController.getCountries);
  app.get('/api/fuelly', apiController.getFuelly);
  app.get('/api/fuelly-avg', apiController.getFuellyAvg);
  app.get('/api/player-fm', apiController.getPlayerFm);
  app.get('/api/*', (req, res) => {
    response.notFound(res, `Requested API resource at '${req.path}' not found`);
  });

  // All requests that are not '/api/*' get sent the React page
  app.get('*', homeController.getReactPage);
};
