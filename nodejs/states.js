const appConfig = require('./app-config');

exports.get = (userId) => {
  return appConfig.get(userId).then((config) => {
    const visited = config && config.states && config.states.visited;

    if (!visited) {
      return Promise.reject('States config is missing');
    }

    return visited;
  });
};
