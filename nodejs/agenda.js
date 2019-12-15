var Agenda = require('agenda');

const secrets = require('../config/secrets');
const logger = require('./log');

const agenda = new Agenda({ db: { address: secrets.db } });
exports.agenda = agenda;

require('./jobs')(agenda);

// IIFE to give access to async/await
(async function() {
  logger.warn('Agenda started!');
  await agenda.start();
})();

exports.removeUserJobs = async (userId) => {
  const numRemoved = await agenda.cancel({ 'data.userId': userId });
  return numRemoved;
};
