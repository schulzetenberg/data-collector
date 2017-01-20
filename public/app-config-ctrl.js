
app.controller('appConfigCtrl', function($scope, $window, dataFactory) {

  $scope.getData = function(){
    dataFactory.getAppConfig().then(function(response) {
      if(response.data && response.data.config){
        $scope.init = false;
        $scope.selectedNewApp = null;
        $scope.newAppConfig = {};
        $scope.appList = objectList(response.data.config);
        $scope.config = response.data.config;
        $scope.scheduleList = scheduleList($scope.config, $scope.appList.existingApp);
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

  $scope.saveAppConfig = function(){

    dataFactory.saveAppConfig($scope.config).then(function() {
      $scope.getData();
      alertify.success("Updated app config");
      }, function(err) {
        alertify.error("Error updating app config");
      console.log(err.data);
    });
  };

  $scope.runApp = function(app){
    if(!$scope.config[app].filePath || !$scope.config[app].functionName){
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
        }
    });
  };

  $scope.restartScheduler = function(){
    alertify.confirm("Restart scheduler: Are you sure?", function (ok) {
      if(ok){
        dataFactory.scheduler().then(function() {
          alertify.success("Scheduler restarted");
          }, function(err) {
          console.log(err);
          alertify.error("Error. Scheduler not restarted");
        });
      }
    });
  };

  $scope.getTypeof = function(obj){
    var type = typeof obj;
    if (type === 'object'){
      if(Array.isArray(obj)) {
        type = 'array';
        if(obj.length > 0){
          var inside = $scope.getTypeof(obj[0]);
          if(inside === 'object') type = 'arrayObj';
        }
      }
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

  $scope.addObject = function(app, key, obj) {
    if(!app || !key || !obj) return console.log("Cant add object. Missing app, key or obj");
    $scope.config[app][key].push(obj);
  };

  $scope.removeObject = function(app, key, index) {
    if(!app || !key || index === undefined) return console.log("Cant remove object. Missing app, key or index");
    if($scope.config[app][key].length === 1) return alertify.error('Cannot remove last object. Schema data will be lost');
    $scope.config[app][key].splice(index, 1);

    // The angular datatable is removing the wrong row, but the correct row is being removed from the array
    // The short term solution is to refresh the page on delete to get datatable in sync with the actual data
    dataFactory.saveAppConfig($scope.config).then(function() {
      location.reload();
      }, function(err) {
        alertify.error("Error updating app config");
      console.log(err.data);
    });
  };

});

function objectList(o){
  var newApp = [],
    existingApp = [];

  Object.keys(o).forEach(function(key) {
    if(o[key] !== null && typeof o[key] === 'object'){
      if(!o[key].active){
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

function scheduleList(config, apps){
  var schedules = [];
  for(var i=0, x=apps.length; i < x; i++){
    if(config[apps[i]].scheduleList) {
      for(var j=0, y=config[apps[i]].scheduleList.length; j < y; j++){
        schedules.push({
          app: apps[i],
          schedule: config[apps[i]].scheduleList[j],
          value: 0.1 * i
        });
      }
    }
  }
  return schedules;
}
