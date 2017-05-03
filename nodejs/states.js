var Q = require('q');

var logger = require('./log');
var appConfig = require('./app-config');

exports.get = function() {
  var defer = Q.defer();
  var defaultConfig = require('../config/states');

  appConfig.get().then(function(config){
    var lived = config && config.states && config.states.lived;
    var visited = config && config.states && config.states.visited;
    if(!lived || !visited) return logger.error("States config missing");

    updateStates(defaultConfig, visited, 1);
    updateStates(defaultConfig, lived, 2);

    defer.resolve(defaultConfig);
  }).catch(function(err){
    defer.reject(err);
  });

  return defer.promise;
};

// 0: never visited
// 1: visited
// 2: lived
function updateStates(states, update, value){
  for(var i=0, x=states.length; i < x; i++){
    for(var j=0, y=update.length; j < y; j++){
      if((states[i][0].v === ('US-' + update[j])) || (states[i][0].f === update[j])){
        states[i][1] = value;
      }
    }
  }
}
