const appConfig = require('./app-config');
const logger = require('./log');
const { removeUserJobs } = require('./agenda');

exports.run = async (agenda, userId) => {
  let config;

  try {
    const removedJobs = await removeUserJobs(userId);
    logger.info(`Removed ${removedJobs} jobs`);
  } catch (e) {
    logger.error(`Error removing existing jobs for user ${userId}`);
    return Promise.reject('Error scheduling the jobs');
  }

  try {
    config = await appConfig.get(userId);
  } catch (e) {
    logger.error(`Error getting app config for user ${userId}`);
    return Promise.reject('Error scheduling the jobs');
  }

  if (!config) {
    logger.error(`Scheduler not started for user ${userId}. No config saved in db`);
    return Promise.reject('No config saved in the database');
  }

  const appList = objectList(config);

  for (let i = 0, x = appList.length; i < x; i += 1) {
    const app = appList[i];

    if (config[app].active && config[app].schedule) {
      try {
        logger.info(`schedule app for user ${userId}`, app);
        agenda.every(config[app].schedule, app, { userId });
      } catch (err) {
        logger.error(`Error scheduling appplication ${app}. Error:`, err);
        return Promise.reject('Error scheduling the jobs');
      }
    }
  }
};

function objectList(o) {
  const objects = [];

  Object.keys(o).forEach((key) => {
    if (o[key] !== null && typeof o[key] === 'object' && key !== '_id') {
      const empty = isEmptyObject(o[key]);

      if (!empty) {
        objects.push(key);
      }
    }
  });

  return objects;
}

function isEmptyObject(o) {
  return Object.keys(o).every((x) => {
    return !o[x] || (Array.isArray(o[x]) && o[x].length === 0);
  });
}
