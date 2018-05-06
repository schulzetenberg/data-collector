const Q = require('q');

const logger = require('./log');
const appConfig = require('./app-config');
const defaultConfig = require('../config/states');

exports.get = function() {
  const defer = Q.defer();

  appConfig.get().then(function(config) {
    const lived = config && config.states && config.states.lived;
    const visited = config && config.states && config.states.visited;

    if (!lived || !visited) {
      return logger.error('States config missing');
    }

    const dataArr = [['State', 'Value']];

    for (let i = 0; i < lived.length; i++) {
      dataArr.push([ `US-${lived[i]}`, 2 ]);
    }

    for (let i = 0; i < visited.length; i++) {
      dataArr.push([ `US-${visited[i]}`, 1 ]);
    }

    for (let i = 0; i < defaultConfig.length; i++) {
      if ((lived.indexOf(defaultConfig[i]) === -1) && (visited.indexOf(defaultConfig[i]) === -1)) {
        dataArr.push([ `US-${defaultConfig[i]}`, 0 ]);
      }
    }

    defer.resolve(dataArr);
  }).catch(function(err) {
    defer.reject(err);
  });

  return defer.promise;
};
