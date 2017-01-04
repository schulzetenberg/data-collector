var nodeSchedule = require('node-schedule');

var appConfig = require('./app-config');

exports.run = function(){
  appConfig.get().then(function(config){
    var appList = objectList(config);

    for(var i=0, x=appList.length; i < x; i++){
      var app = appList[i];
      console.log("RUN THE SCHEDULE!",app);
      if(config[app].schedule && config[app].filePath && config[app].functionName){
        try {
          var scheduledFunction = require('../' + config[app].filePath)[config[app].functionName];
          if(typeof scheduledFunction !== 'function') {
            throw config[app].filePath + ".js " + config[app].functionName + "(), not a function";
          }
          nodeSchedule.scheduleJob(config[app].schedule, scheduledFunction);
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
  return Object.keys(o).every(function(x) { return !o[x]; });
}
