const isProd = process.env.NODE_ENV === 'production';

const response = {
  success: (res, json = { message: 'Success', data: null }) => res.status(200).send({ ...json, errors: null }),
  userError: (res, error = 'User Error') => res.status(400).send({ errors: [error] }),
  serverError: (res, error = 'Server Error') =>
    isProd ? res.sendStatus(500) : res.status(500).send({ errors: [error] }),
  loginRequired: (res, error = 'You must be logged in to access this resource') =>
    res.status(401).send({ errors: [error] }),
  notFound: (res, error = 'Resource not found') => res.status(404).send({ errors: [error] }),
};

module.exports = response;
