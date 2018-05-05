const parseString = require('xml2js').parseString;
const Q = require('q');

const logger = require('./log');
const fuellyModel = require('../models/fuelly-model.js');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = function() {
  logger.info('Starting Fuelly');

  appConfig.get().then(function(config) {
    const defer = Q.defer();

    var promiseArr = [];
    var numVehicles = config && config.fuelly && config.fuelly.vehicles && config.fuelly.vehicles.length;

    if (!numVehicles) {
      defer.reject('No vehicles');
    } else {
      for (let i = 0, x=numVehicles; i < x; i++) {
        let vehicleConf = config.fuelly.vehicles[i];
        promiseArr.push(carData(vehicleConf));
      }
    }

    Q.all(promiseArr).then(function() {
      defer.resolve();
    }).then(function() {
      logger.info('Done getting Fuelly data')
    }).catch(function(err) {
      logger.error(err);
    });

    return defer.promise;
  }).catch(function(err) {
    logger.error(err);
  });
};

function carData(config) {
  var defer = Q.defer();
  var url = config && config.url;

  if (!url) {
    defer.reject('Missing fuelly config');
  } else {
    api.get({url}).then(function(body) {
      try {
        var data = [];
        parseString(body, function (err, result) {
          if (err) {
            return defer.reject(err);
          }

          var entries = result.rss.channel[0].item;

          if (entries && entries.length) {
            for(let i=0, x=entries.length; i < x; i++) {
              let desc = entries[i].description[0];

              let milesIndex = desc.indexOf('Miles:');
              let milesBreak =  desc.indexOf('<br />', milesIndex);
              let miles = parseFloat(desc.substring(milesIndex + 7, milesBreak));

              let gallonsIndex = desc.indexOf('Gallons:');
              let gallonsBreak =  desc.indexOf('<br />', gallonsIndex);
              let gallons = parseFloat(desc.substring(gallonsIndex + 9, gallonsBreak));

              let priceIndex = desc.indexOf('Price: $');
              let price = 0;
              if (priceIndex > -1) {
                price = parseFloat(desc.substring(priceIndex + 8, priceIndex + 12));
              }

              let fillTime = entries[i].pubDate[0];

              data.push({ fillTime, miles, gallons, price, name: config.name });
            }
          } else {
            defer.reject('No fuel data from fuelly for ' + config.name);
          }
        });

        let saveArray = [];

        for (let j = 0, x=data.length; j<x; j++) {
          saveArray.push(save(data[j]));
        }

        Q.all(saveArray).then(function(){
          defer.resolve();
        }).catch(function(err){
          defer.reject(err);
        });
      } catch(err) {
        defer.reject(err);
      }

    }).catch(function(err) {
      logger.error(err);
      defer.reject('Get fuelly data error');
    });
  }

  return defer.promise;
}

function save(data) {
  const defer = Q.defer();

  const filter = {
    name: data.name,
    fillTime: data.fillTime
  };

  fuellyModel.findOne(filter, {}, {sort: { '_id' : -1 }}).lean().then(function(oldData) {
    // If fillTime already exists in DB, do not save duplicate data
    if (!oldData) {
      const doc = new fuellyModel(data);
      return doc.save();
    } else {
      defer.resolve(); // Data already exists
    }
  }).catch(function(err) {
    defer.reject(err);
  });

  return defer.promise;
}
