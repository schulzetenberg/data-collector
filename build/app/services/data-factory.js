app.factory('dataFactory', ['$http', function($http) {
  $http.defaults.headers.common.Accept = 'application/json, text/plain';
  var dataFactory = {};

  dataFactory.getAppConfig = function() {
    return $http.get('/app-config/config');
  };

  dataFactory.saveAppConfig = function(data) {
    return $http.post('/app-config/config', data);
  };

  return dataFactory;
}]);
