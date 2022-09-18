/* eslint-disable no-param-reassign */

const _ = require('lodash');
const parser = require('cron-parser');

const logger = require('../nodejs/log');
const ConfigModel = require('../models/app-config');
const appConfig = require('../nodejs/app-config');
const response = require('../nodejs/response');
const mongoUtils = require('../nodejs/mongo-utils');
const scheduler = require('../nodejs/scheduler');
const { agenda } = require('../nodejs/agenda');
const parksList = require('../config/parks');
const parks = require('../nodejs/parks');
const statesList = require('../config/states');
const countriesList = require('../config/countries');
const appModules = require('../nodejs/app-modules');

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
        data.parks = data.parks || {};
        data.states = data.states || {};
        data.countries = data.countries || {};

        data.parks.visited = data.parks.visited?.map((x) => ({
          ...x,
          label: parksList.find((p) => x.value === p.value).label,
        }));
        data.parks.options = parksList;

        data.states.visited = data.states.visited.map((x) => ({ value: x, label: x }));
        data.states.options = statesList.map((x) => ({ value: x, label: x }));

        data.countries.visited = data.countries.visited.map((x) => ({ value: x, label: x }));
        data.countries.options = countriesList.map(({ country }) => ({ value: country, label: country }));

        _.forIn(data, (value, key) => {
          data[key].lastUpdated = lastUpdateData[key] ? lastUpdateData[key] : null;

          if (value && value.schedule) {
            try {
              const interval = parser.parseExpression(value.schedule, { utc: true });
              const scheduleArr = [];

              for (let i = 0; i < 5; i += 1) {
                const nextInterval = interval.next();
                scheduleArr.push(nextInterval.toString());
              }

              data[key].scheduleList = scheduleArr;
            } catch (err) {
              logger.error(`Cannot parse schedule ${value.schedule}. Err:${err.message}`);
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
exports.saveConfig = async (req, res, next) => {
  const data = req.body;

  if (!data) {
    return next('No config data to save');
  }

  if (data.appName === 'parks' && data.parks.visited.length > 0) {
    // eslint-disable-next-line no-underscore-dangle
    data.parks.visited = await parks.uploadAllImages(data.parks, req.user._id);
  }

  if (data.states && data.states.visited) {
    data.states.visited = data.states.visited.map((x) => x.value);
  }

  if (data.countries && data.countries.visited) {
    data.countries.visited = data.countries.visited.map((x) => x.value);
  }

  delete data.updatedAt;
  delete data.createdAt;
  // eslint-disable-next-line no-underscore-dangle
  delete data._id;
  const doc = new ConfigModel(data);

  doc
    .save()
    .then(() => exports.getConfig(req, res, next))
    .then(() =>
      // eslint-disable-next-line no-underscore-dangle
      scheduler.run(agenda, req.user._id)
    )
    .catch((err) => {
      logger.error(err);
      return next('Error saving config');
    });
};

/**
 * POST /app-config/run-app
 * Manually run application
 */
exports.runApp = async (req, res) => {
  const app = req.body && req.body.app;

  if (!app) {
    return response.userError(res, 'No app specified');
  }

  // eslint-disable-next-line no-underscore-dangle
  // appConfig.get(req.user._id).then((config) => {
  try {
    logger.info(`Starting ${app} save`);
    // eslint-disable-next-line no-underscore-dangle
    await appModules[app].save(req.user._id);
    logger.info(`Finished ${app} save`);
  } catch (err) {
    logger.error('Error running appplication. Error:', err);
    return res.sendStatus(500);
  }

  res.sendStatus(200);
};
