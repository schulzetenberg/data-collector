const isProd = process.env.NODE_ENV === 'production';

const response = {
	success: (res, json = { message: 'Success', data: null }) => res.status(200).send({ ...json, error: null }),
	userError: (res, error = 'User Error') => res.status(400).send({ error }),
	serverError: (res, error = 'Server Error') => isProd ? res.sendStatus(500) : res.status(500).send({ error }),
	loginRequired: (res, error = 'You must be logged in to access this resource') => res.status(401).send({ error }),
};

module.exports = response;
