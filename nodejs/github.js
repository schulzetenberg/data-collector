const Q = require('q');

const logger = require('./log');
const githubModel = require('../models/github-model.js');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = function() {
  logger.info('Starting Github');

  appConfig.app('github').then(function(githubConfig) {
    if(githubConfig && githubConfig.user && githubConfig.token) {
      let promises = [
        // Contributions data
        api.get({
          url: 'https://github.com/users/' + githubConfig.user + '/contributions',
          headers: { 'ACCEPT': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' }
        }),

        // User data
        api.get({
          url: 'https://api.github.com/users/' + githubConfig.user + '?access_token=' + githubConfig.token + '&per_page=100',
          headers: { 'User-Agent': 'GitHub User:' + githubConfig.user }
        }),

        // Followers data
        api.get({
          url: 'https://api.github.com/users/' + githubConfig.user + '/followers' + '?access_token=' + githubConfig.token + '&per_page=100',
          headers: { 'User-Agent': 'GitHub User:' + githubConfig.user }
        }),

        // Following data
        api.get({
          url: 'https://api.github.com/users/' + githubConfig.user + '/following' + '?access_token=' + githubConfig.token + '&per_page=100',
          headers: { 'User-Agent': 'GitHub User:' + githubConfig.user }
        })
      ];

      Q.all(promises).then(function(data){
        let doc = new githubModel({
          contribSvg: data[0],
          repos: data[1].public_repos,
          followers: data[2],
          following: data[3]
        });

        doc.save().catch(function(err) {
          logger.error(err);
        });
      }).then(function(){
        logger.info('Done with Github save');
      }).catch(function(err){
        logger.error('Github error:', err);
      });
    } else {
      logger.error('Github config missing');
    }
  }).catch(function(err){
    logger.error('Github config error:', err);
  });
};
