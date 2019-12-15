const appModules = {
  music: require('./music'),
  goodreads: require('./goodreads'),
  github: require('./github'),
  trakt: require('./trakt'),
  tmdb: require('./tmdb'),
  fuelly: require('./fuelly'),
  fuelly: require('./fuelly'),
  playerFm: require('./player-fm'),
  feedly: require('./feedly'),
};

module.exports = (agenda) => {
  Object.keys(appModules).forEach((app) => {
    agenda.define(app, async (job) => {
      const { userId } = job.attrs.data;
      appModules[app].save(userId);
    });
  });
};
