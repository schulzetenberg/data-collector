const AllocationModel = require('../models/allocation-model');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = (userId) => {
  // TODO
  appConfig
    .app(userId)
    .then((allocationConfig) => {
      if (!allocationConfig || !allocationConfig.user || !allocationConfig.token) {
        return Promise.reject('Allocation config missing');
      }
      const ticker = 'VV';

      const promises = [
        api.get({
          // eslint-disable-next-line max-len
          url: `https://api.vanguard.com/rs/ire/01/ind/fund/${ticker}/profile.jsonp?callback=angular.callbacks._0`,
          headers: { Referer: 'https://investor.vanguard.com/' },
        }),
      ];
      return Promise.all(promises).then((data) => {
        let parsedData = data[0].slice(21); // Remove 'angular.callbacks._0(' from start of string
        parsedData = parsedData.substring(0, parsedData.length - 1); // Remove ')' from end of string
        const jsonData = JSON.parse(parsedData);

        // eslint-disable-next-line no-param-reassign
        data[0] = jsonData;
        return data;
      });
    })
    .then((data) => {
      const doc = new AllocationModel({
        userId,
        profile: data[0],
      });

      return doc.save();
    });
};
