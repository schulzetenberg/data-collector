const cheerio = require('cheerio');
const GithubModel = require('../models/github-model');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = (userId) =>
  appConfig
    .app(userId, 'github')
    .then((githubConfig) => {
      if (!githubConfig || !githubConfig.user || !githubConfig.token) {
        return Promise.reject('Github config missing');
      }

      const promises = [
        // Contributions data
        api.get({
          url: `https://github.com/users/${githubConfig.user}/contributions`,
          headers: { ACCEPT: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' },
        }),

        // User data
        api.get({
          url: `https://api.github.com/users/${githubConfig.user}?per_page=100`,
          headers: { 'User-Agent': `GitHub User:${githubConfig.user}`, Authorization: `token ${githubConfig.token}` },
        }),

        // Followers data
        api.get({
          url: `https://api.github.com/users/${githubConfig.user}/followers?per_page=100`,
          headers: { 'User-Agent': `GitHub User:${githubConfig.user}`, Authorization: `token ${githubConfig.token}` },
        }),

        // Following data
        api.get({
          url: `https://api.github.com/users/${githubConfig.user}/following?per_page=100`,
          headers: { 'User-Agent': `GitHub User:${githubConfig.user}`, Authorization: `token ${githubConfig.token}` },
        }),
      ];

      return Promise.all(promises);
    })
    .then((data) => {
      const $ = cheerio.load(data[0]);
      let contributions;
      const contributionText = $('h2.f4').text();

      if (contributionText) {
        contributions = parseInt(contributionText, 10);
      }

      const doc = new GithubModel({
        userId,
        contribSvg: data[0],
        contributions,
        repos: data[1].public_repos,
        followers: data[2],
        following: data[3],
      });

      return doc.save();
    });
