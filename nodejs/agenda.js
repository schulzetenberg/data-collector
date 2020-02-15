const Agenda = require('agenda');

const secrets = require('../config/secrets');
const logger = require('./log');

const agenda = new Agenda({ db: { address: secrets.db } });
exports.agenda = agenda;

const appModules = require('./app-modules');

Object.keys(appModules).forEach((app) => {
  agenda.define(app, async (job) => {
    const { userId } = job.attrs.data;
    appModules[app].save(userId);
  });
});

// IIFE to give access to async/await
(async () => {
  logger.warn('Agenda started!');
  await agenda.start();
})();

exports.removeUserJobs = async (userId) => {
  const numRemoved = await agenda.cancel({ 'data.userId': userId });
  return numRemoved;
};
