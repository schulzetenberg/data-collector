var _ = require('lodash');
var moment = require('moment');
var parser = require('cron-parser');

var configModel = require('../models/app-config');
var appConfig = require('../nodejs/app-config');

/**
 * GET /app-config-page
 * Application config page
 */
exports.getConfigPage = function(req, res) {
  res.render('app-config.html', { title: 'Application Configuration' });
};

/**
 * GET /app-config/config
 * Get application config
 */
exports.getConfig = function(req, res, next) {

  appConfig.get().then(function(data){
    if(data) {
      _.forIn(data, function(value, key) {
        if(value && value.schedule){
          try {
            var interval = parser.parseExpression(value.schedule, {utc: true});
            var scheduleArr = [];
            var next = interval.next();

            while(next.toDate() <= moment().add(1, 'days').toDate()) {
              scheduleArr.push(next.toString());
              next = interval.next();
            }

            data[key].scheduleList = scheduleArr;
          } catch (err) {
            console.log('Cannot parse schedule ' + value.schedule + ". Err:" + err.message);
          }
        }
      });
    }

    res.send({ config: data });
  }).catch(function(err){
    console.log(err);
    return next(err);
  });
};

/**
 * POST /app-config
 * Save application config
 */
exports.saveConfig = function(req, res, next) {
  var data = req.body;
  if(!data) return next('No config data to save');
  delete data.updatedAt;
  delete data.createdAt;
  delete data._id;
  var doc = new configModel(data);

  doc.save(function(err) {
    if (err) return next('Error saving config');
    res.sendStatus(200);
  });
};

/**
 * POST /app-config/run-app
 * Manually run application
 */
exports.runApp = function(req, res, next) {
  var data = req.body;
  if(!data || !data.app) return next('No App to run');

  appConfig.get().then(function(config){
    if(config[data.app].filePath && config[data.app].functionName){
      try {
        var scheduledFunction = require('../' + config[data.app].filePath)[config[data.app].functionName];
        if(typeof scheduledFunction !== 'function') {
          throw config[data.app].filePath + ".js " + config[data.app].functionName + "(), not a function";
        }
        scheduledFunction();
      } catch (err){
        console.log("Error running appplication. Error:", err);
        return res.sendStatus(500);
      }
      res.sendStatus(200);
    } else {
      return next("App missing file path or function name");
    }
  });

};
