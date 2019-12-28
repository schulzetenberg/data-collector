const _ = require('lodash');
const parser = require('cron-parser');

const logger = require('../nodejs/log');
const ConfigModel = require('../models/app-config');
const appConfig = require('../nodejs/app-config');
const response = require('../nodejs/response');
const mongoUtils = require('../nodejs/mongo-utils');
const scheduler = require('../nodejs/scheduler');
const { agenda } = require('../nodejs/agenda');

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
exports.getConfig = async (req, res) => {
  const lastUpdateData = await mongoUtils.getLatestDocTimestamps();

  appConfig
    // eslint-disable-next-line no-underscore-dangle
    .get(req.user._id)
    .then((data) => {
      if (data) {
        _.forIn(data, (value, key) => {
          // eslint-disable-next-line no-param-reassign
          data[key].lastUpdated = lastUpdateData[key] ? lastUpdateData[key] : null;

          if (value && value.schedule) {
            try {
              const interval = parser.parseExpression(value.schedule, { utc: true });
              const scheduleArr = [];

              for (let i = 0; i < 5; i += 1) {
                const nextInterval = interval.next();
                scheduleArr.push(nextInterval.toString());
              }

              // eslint-disable-next-line no-param-reassign
              data[key].scheduleList = scheduleArr;
            } catch (err) {
              console.log(`Cannot parse schedule ${value.schedule}. Err:${err.message}`);
            }
          }
        });
      }

      response.success(res, { data });
    })
    .catch((err) => {
      logger.error(err);
      response.serverError(res, 'Error getting application config');
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
  const doc = new ConfigModel(data);

  doc
    .save()
    .then(() => {
      return exports.getConfig(req, res, next);
    })
    .then(() => {
      // eslint-disable-next-line no-underscore-dangle
      return scheduler.run(agenda, req.user._id);
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

  // eslint-disable-next-line no-underscore-dangle
  appConfig.get(req.user._id).then((config) => {
    if (config[data.app].filePath && config[data.app].functionName) {
      try {
        // TODO: get the function and call it!
        // scheduledFunction(req.user._id);
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
