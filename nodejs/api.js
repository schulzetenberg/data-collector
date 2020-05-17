// Create seperate API module in order to abstract HTTP functionality

const request = require('requestretry').defaults({
  json: true,
  maxAttempts: 5, // 5 retries on failure
  retryDelay: 5000, // 5 seconds
});

const email = require('./email');

/*
  params = {
    url: String,
		headers: {}, optional
		fullResponse, optional
		encoding, optional
  }
*/
exports.get = (params) => {
  return request
    .get({
      url: formatUrl(params.url),
      headers: params.headers || { 'Content-Type': 'application/json' },
      encoding: params.encoding !== undefined ? params.encoding : 'utf8',
    })
    .then((data) => {
      if (data.statusCode !== 201 && data.statusCode !== 200) {
        return Promise.reject(
          `API GET error for: ${params.url}. Status Code: ${data.statusCode}. Status Message: ${data.statusMessage}`
        );
      }

      return params.fullResponse ? data : data.body;
    });
};

/*
  params = {
    url: String,
    body: {}, optional
    form, {}, optional
    auth: {}, optional
    headers: {}, optional
    emailTo: String, optional
    emailSubject: String, optional
  }
*/
// POST API call. If posting the data fails, fallback to email if email subject exists
exports.post = (params) => {
  const options = {
    url: formatUrl(params.url),
    body: params.body || {},
    auth: params.auth || {},
    headers: params.headers || { 'Content-Type': 'application/json' },
  };

  if (params.form) {
    options.form = params.form;
  }

  return request
    .post(options)
    .then((data) => {
      return data.body;
    })
    .catch((err) => {
      if (params.emailSubject) {
        return email.send({ to: params.emailTo, subject: params.emailSubject, html: params.body });
      }
      return Promise.reject(err);
    });
};

// Add http to URL if it is missing
function formatUrl(url) {
  const pattern = /^((http|https):\/\/)/;

  if (!pattern.test(url)) {
    // eslint-disable-next-line no-param-reassign
    url = `http://${url}`;
  }

  return url;
}
