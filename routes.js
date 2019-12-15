const passportConf = require('./config/passport');

// Controllers
const homeController = require('./controllers/home');
const userController = require('./controllers/user');
const settingsController = require('./controllers/settings');
const appConfigController = require('./controllers/app-config');
const apiController = require('./controllers/api');
const bruteforceController = require('./controllers/brute-force');

module.exports = (app) => {
  app.get('/', passportConf.isAuthenticated, appConfigController.getConfigPage);
  app.get('/react', homeController.getReactPage);
  app.get('/app-config', passportConf.isAuthenticated, appConfigController.getConfigPage);
  app.get('/app-config/config', passportConf.isAuthenticated, appConfigController.getConfig);
  app.post('/app-config/config', passportConf.isAuthenticated, appConfigController.saveConfig);
  app.post('/app-config/run-app', passportConf.isAuthenticated, appConfigController.runApp);

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
  app.get('/forgot', userController.getForgot);
  app.post('/forgot', userController.postForgot);
  app.get('/reset/:token', userController.getReset);
  app.post('/reset', userController.postReset);
  app.get('/signup', userController.getSignup);
  app.post('/signup', userController.postSignup);
  app.get('/api-key', userController.getNewApiKey);

  app.get('/account', passportConf.isAuthenticated, userController.getAccount);
  app.get('/account/profile', passportConf.isAuthenticated, userController.getProfile);
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
};
