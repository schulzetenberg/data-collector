var schedule = require('node-schedule');

var appConfig = require('./app-config');
var scheduledJobs = [];

exports.run = function(){
  // Clear out current jobs before scheduling new jobs
  for(var i=0, x=scheduledJobs.length; i < x; i++){
    scheduledJobs[i].cancel();
  }

  appConfig.get().then(function(config){
    if(!config) return console.log("Scheduler not started. No config saved in db");
    var appList = objectList(config);

    for(var i=0, x=appList.length; i < x; i++){
      var app = appList[i];

      if(config[app].schedule && config[app].filePath && config[app].functionName){
        try {
          var scheduledFunction = require('../' + config[app].filePath)[config[app].functionName];
          if(typeof scheduledFunction !== 'function') {
            throw config[app].filePath + ".js " + config[app].functionName + "(), not a function";
          }
          var job = schedule.scheduleJob(config[app].schedule, scheduledFunction);
          scheduledJobs.push(job);
        } catch (err){
          console.log("Error scheduling appplication. Error:", err);
        }
      }
    }
  }).catch(function(err){
    console.log(err);
  });
};

function objectList(o){
  var objects = [];

  Object.keys(o).forEach(function(key) {
    if(o[key] !== null && typeof o[key] === 'object' &&  key !== '_id'){
      var empty = isEmptyObject(o[key]);
      if(!empty){
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
