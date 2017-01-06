app.controller('appConfigCtrl', function($scope, $window, dataFactory) {

  $scope.getData = function(){
    dataFactory.getAppConfig().then(function(response) {
      if(response.data && response.data.config){
        $scope.init = false;
        $scope.selectedNewApp = null;
        $scope.newAppConfig = {};
        $scope.appList = objectList(response.data.config);
        $scope.config = response.data.config;
      } else {
        console.log("No config data!");
        $scope.init = true;
      }

      if(response.data && response.data.schedules){
        $scope.schedules = response.data.schedules;
      } else {
        console.log("No schedule data!");
      }
    }, function(err) {
      console.log(err.data);
    });
  };
  $scope.getData();

  $scope.saveAppConfig = function(status){
    if(status === 'new') {
      // Add new app config object to existing config
      Object.keys($scope.newAppConfig).forEach(function(key) { $scope.config[key] = $scope.newAppConfig[key]; });
    }

    dataFactory.saveAppConfig($scope.config).then(function() {
      $scope.getData();
      alertify.success("Updated app config");
      }, function(err) {
        alertify.error("Error updating app config");
      console.log(err.data);
    });
  };

  $scope.runApp = function(app){
    if(!$scope.config[app].filePath || !$scope.config[app].function){
      return alertify.error("Application not configured to run");
    }

    alertify.confirm("Manually run application " + app + "?", function (ok) {
        if (ok) {
          dataFactory.runApp({app: app}).then(function() {
            alertify.success("Application " + app + " started");
            }, function(err) {
            console.log(err);
            alertify.error("Error. Application " + app + " not started");
          });
        } else {
            // user clicked "cancel"
        }
    });
  };

  $scope.initApps = function(){
    alertify.confirm("Initalization will replace any existing application settings. Are you sure?", function (ok) {
        if (ok) {
          dataFactory.initApps().then(function() {
            alertify.success("Applications initialized");
            $scope.getData();
            }, function(err) {
            console.log(err);
            alertify.error("Error. Applications not initialized");
          });
        } else {
            // user clicked "cancel"
        }
    });
  };

  $scope.reloadScheduler = function(){
    dataFactory.scheduler().then(function() {
      alertify.success("Scheduler restarted");
      }, function(err) {
      console.log(err);
      alertify.error("Error. Scheduler not restarted");
    });
  };

  $scope.getTypeof = function(obj){
    var type = typeof obj;
    if (type === 'object'){
      if(Array.isArray(obj)) type = 'array';
    }
    return type;
  };

  $scope.removeArrItem = function(app, key, option){
    if(!option) return;
    var index = $scope.config[app][key].indexOf(option);
    if (index > -1) {
      $scope.config[app][key].splice(index, 1);
    } else {
      alertify.error("Error removing option " + option);
    }
  };

  $scope.addArrItem = function(app, key, option){
    $scope.config[app][key].push(option);
  };

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
  return Object.keys(o).every(function(x) {
    return !o[x] || (Array.isArray(o[x]) && o[x].length === 0);
  });
}
