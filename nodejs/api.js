// Create seperate API module in order to abstract HTTP functionality

const request = require('requestretry').defaults({
  json: true,
  maxAttempts: 5, // 5 retries on failure
  retryDelay: 5000, // 5 seconds
});

/*
  params = {
    url: String,
    headers: {}, optional
  }
*/
exports.get = function(params) {
  return request.get({
    url: formatUrl(params.url),
    headers: params.headers || { 'Content-Type': 'application/json' }
  }).then(function(data){
    if(data.statusCode !== 201 && data.statusCode !== 200){
      return Promise.reject('API GET error for: ' + params.url + '. Status Code: ' + data.statusCode + '. Status Message: ' + data.statusMessage);
    }

    return data.body;
  })
};

/*
  params = {
    url: String,
    body: {}, optional
    form, {}, optional
    auth: {}, optional
    headers: {}, optional
  }
*/
exports.post = function(params) {
  const options = {
    url: formatUrl(params.url),
    body: params.body || {},
    auth: params.auth || {},
    headers: params.headers || { 'Content-Type': 'application/json' }
  };

  if(params.form) options.form = params.form;

  return request.post(options).then(function(data){
    return data.body;
  })
};

// Add http to URL if it is missing
function formatUrl(url) {
  let pattern = /^((http|https):\/\/)/;
  if(!pattern.test(url)) url = 'http://' + url;
  return url;
}
