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
  app.post('/account/remove-api-key', passportConf.isAuthenticated, userController.removeApiKey);

  app.get('/api/music', passportConf.validateApiToken, apiController.getMusic);
  app.get('/api/goodreads', passportConf.validateApiToken, apiController.getGoodreads);
  app.get('/api/github', passportConf.validateApiToken, apiController.getGithub);
  app.get('/api/trakt', passportConf.validateApiToken, apiController.getTrakt);
  app.get('/api/states', passportConf.validateApiToken, apiController.getStates);
  app.get('/api/countries', passportConf.validateApiToken, apiController.getCountries);
  app.get('/api/fuelly', passportConf.validateApiToken, apiController.getFuelly);
  app.get('/api/fuelly-avg', passportConf.validateApiToken, apiController.getFuellyAvg);
  app.get('/api/player-fm', passportConf.validateApiToken, apiController.getPlayerFm);
  app.get('/api/instagram', passportConf.validateApiToken, apiController.getInstagram);
  app.get('/api/*', (req, res) => {
    response.notFound(res, `Requested API resource at '${req.path}' not found`);
  });

  // All requests that are not '/api/*' get sent the React page
  app.get('*', homeController.getReactPage);
};
