app.controller('appConfigCtrl', function($scope, $window, dataFactory) {

  dataFactory.getAppConfig().then(function(response) {
    if(response.data){
      $scope.appList = objectList(response.data);
      $scope.config = response.data;
      console.log($scope.config);
    } else {
      console.log("No config data!");
    }

    console.log($scope.appList);
  }, function(err) {
    console.log(err.data);
  });


  $scope.saveAppConfig = function(){
    dataFactory.saveAppConfig($scope.config).then(function(response) {
      $window.location.reload();
      }, function(err) {
      console.log(err.data);
    });
  };

  $scope.getTypeof = function(obj){
    return typeof obj;
  }

});

function objectList(o){
  var newApp = [],
    existingApp = [];

  Object.keys(o).forEach(function(key) {
    if(o[key] !== null && typeof o[key] === 'object'){
      var empty = isEmptyObject(o[key]);
      if(empty){
        newApp.push(key);
      } else {
        existingApp.push(key);
      }
    }
  });

  return { newApp: newApp, existingApp: existingApp };
}

function isEmptyObject(o) {
  return Object.keys(o).every(function(x) { return !o[x]; });
}
