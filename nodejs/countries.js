const appConfig = require('./app-config');

exports.get = (userId) => {
  return appConfig.get(userId).then((config) => {
    const visited = config && config.countries && config.countries.visited;

    if (!visited) {
      return Promise.reject('Countries config is missing');
    }

    return visited;
  });
};
