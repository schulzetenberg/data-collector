const _ = require('lodash');
const moment = require('moment');
const parser = require('cron-parser');

const configModel = require('../models/app-config');
const appConfig = require('../nodejs/app-config');

/**
 * GET /app-config-page
 * Application config page
 */
exports.getConfigPage = (req, res) => {
  res.render('app-config.html', { title: 'Application Configuration' });
};

/**
 * GET /app-config/config
 * Get application config
 */
exports.getConfig = (req, res, next) => {
  appConfig
    .get()
    .then((data) => {
      if (data) {
        _.forIn(data, (value, key) => {
          if (value && value.schedule) {
            try {
              const interval = parser.parseExpression(value.schedule, { utc: true });
              const scheduleArr = [];
              let next = interval.next();

              while (
                next.toDate() <=
                moment()
                  .add(1, 'days')
                  .toDate()
              ) {
                scheduleArr.push(next.toString());
                next = interval.next();
              }

              data[key].scheduleList = scheduleArr;
            } catch (err) {
              console.log(`Cannot parse schedule ${value.schedule}. Err:${err.message}`);
            }
          }
        });
      }

      res.send({ config: data });
    })
    .catch((err) => {
      console.log(err);
      return next(err);
    });
};

/**
 * POST /app-config
 * Save application config
 */
exports.saveConfig = (req, res, next) => {
  const data = req.body;

  if (!data) {
    return next('No config data to save');
  }

  delete data.updatedAt;
  delete data.createdAt;
  // eslint-disable-next-line no-underscore-dangle
  delete data._id;
  const doc = new configModel(data);

  doc
    .save()
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
      return next('Error saving config');
    });
};

/**
 * POST /app-config/run-app
 * Manually run application
 */
exports.runApp = (req, res, next) => {
  const data = req.body;

  if (!data || !data.app) {
    return next('No App to run');
  }

  appConfig.get().then((config) => {
    if (config[data.app].filePath && config[data.app].functionName) {
      try {
        // eslint-disable-next-line
        const scheduledFunction = require(`../${config[data.app].filePath}`)[config[data.app].functionName];

        if (typeof scheduledFunction !== 'function') {
          throw `${config[data.app].filePath}.js ${config[data.app].functionName}(), not a function`;
        }

        scheduledFunction();
      } catch (err) {
        console.log('Error running appplication. Error:', err);
        return res.sendStatus(500);
      }

      res.sendStatus(200);
    } else {
      return next('App missing file path or function name');
    }
  });
};
