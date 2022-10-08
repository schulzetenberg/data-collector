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
        // Contributions SVG
        api.get({
          url: `https://github.com/users/${githubConfig.user}/contributions`,
          headers: { ACCEPT: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8' },
        }),

        // User data
        api.get({
          url: `https://api.github.com/users/${githubConfig.user}`,
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
        publicRepos: data[1]?.public_repos,
        privateRepos: data[1]?.total_private_repos,
        publicGists: data[1]?.public_gists,
        privateGists: data[1]?.private_gists,
        followers: data[1]?.followers,
        following: data[1]?.following,
      });

      return doc.save();
    });
