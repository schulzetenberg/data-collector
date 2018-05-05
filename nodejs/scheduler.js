const schedule = require('node-schedule');

const appConfig = require('./app-config');
const logger = require('./log');
const scheduledJobs = [];

exports.run = function(){
  // Clear out current jobs before scheduling new jobs
  for (let i = 0, x = scheduledJobs.length; i < x; i++) {
    scheduledJobs[i].cancel();
  }

  appConfig.get().then(function(config){
    if(!config) {
      return logger.error('Scheduler not started. No config saved in db');
    }

    var appList = objectList(config);

    for (let i = 0, x=appList.length; i < x; i++) {
      let app = appList[i];

      if (config[app].schedule && config[app].filePath && config[app].functionName) {
        try {
          let scheduledFunction = require('../' + config[app].filePath)[config[app].functionName];
          if (typeof scheduledFunction !== 'function') {
            throw config[app].filePath + '.js ' + config[app].functionName + '(), not a function';
          }

          let job = schedule.scheduleJob(config[app].schedule, scheduledFunction);
          scheduledJobs.push(job);
        } catch (err) {
          logger.error('Error scheduling appplication. Error:', err);
        }
      }
    }
  }).catch(function(err) {
    logger.error(err);
  });
};

function objectList(o) {
  var objects = [];

  Object.keys(o).forEach(function(key) {
    if (o[key] !== null && typeof o[key] === 'object' &&  key !== '_id') {
      var empty = isEmptyObject(o[key]);

      if (!empty) {
        objects.push(key);
      }
    }
  });

  return objects;
}

function isEmptyObject(o) {
  return Object.keys(o).every(function(x) {
    return !o[x] || (Array.isArray(o[x]) && o[x].length === 0);
  });
}
