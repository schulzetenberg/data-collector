const Q = require('q');

const logger = require('./log');
const appConfig = require('./app-config');

exports.get = (userId) => {
  const defer = Q.defer();

  appConfig
    .get(userId)
    .then((config) => {
      const visited = config && config.states && config.states.visited;

      if (!visited) {
        logger.error('States config missing');
      }

      defer.resolve(visited);
    })
    .catch((err) => {
      defer.reject(err);
    });

  return defer.promise;
};
