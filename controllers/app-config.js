var parser = require('cron-parser');
var _ = require('lodash');

var config = require('../models/app-config');

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
  var schedules = {};

  config.findOne({}, {}, { sort: { '_id' : -1 } }).exec(function (err, data) {
    if (err) return next(err);

    if(data) {
      data = data.toJSON();
      _.forIn(data, function(value, key) {
        if(value && value.schedule){
          try {
            var interval = parser.parseExpression(value.schedule, {utc: true});
            var scheduleArr = [];
            for(var i=0, x=10; i < x; i++){
              scheduleArr.push(interval.next().toString());
            }
            schedules[key] = scheduleArr;
            data[key].scheduleList = scheduleArr;
          } catch (err) {
            console.log('Cannot parse schedule ' + value.schedule + ". Err:" + err.message);
          }
        }
      });
    }

    res.send({config: data, schedules: schedules});
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
  var doc = new config(data);

  doc.save(function(err) {
    if (err) return next('Error saving config');
    res.sendStatus(200);
  });
};

/**
 * POST /app-config/run-app
 * Save application config
 */
exports.runApp = function(req, res, next) {
  var data = req.body;
  if(!data) return next('No App to run');

  // TODO
  res.sendStatus(200);
};
