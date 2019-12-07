const moment = require('moment');

const logger = require('./log');
const utils = require('./utils');

const models = {
	playerFm: require('../models/player-fm-model'),
	music: require('../models/music-model'),
	goodreads: require('../models/goodreads-model'),
	github: require('../models/github-model'),
	trakt: require('../models/trakt-model'),
	fuelly: require('../models/fuelly-model'),
};

exports.getLatestDocTimestamps = async () => {
	const returnObj = {};

	function parseData (data) {
		return (data && data.timestamp) ? moment(data.timestamp).fromNow() : null;
	}

	await utils.asyncForEach(Object.keys(models), async (model) => {
		try {
			const latestDoc = await models[model].findOne({}, { timestamp: 1 }, {sort: {'_id' : -1}}).lean();
			returnObj[model] = parseData(latestDoc);
		} catch (e) {
			logger.error(`Error getting latest document for ${model} model`, e);
			returnObj[model] = null;
		}
	});

	return returnObj;
};

