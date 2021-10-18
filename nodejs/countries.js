const appConfig = require('./app-config');
const countriesList = require('../config/countries');

exports.get = (userId) => {
  return appConfig.get(userId).then((config) => {
    const visited = (config && config.countries && config.countries.visited) || [];
    const visitedList = visited.map((x) => countriesList.find((y) => y.country === x));

    if (visitedList.length === 0) {
      return Promise.reject('Countries config is missing');
    }

    return visitedList;
  });
};
