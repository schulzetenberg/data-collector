const { parseString } = require('xml2js');
const Q = require('q');

const logger = require('./log');
const fuellyModel = require('../models/fuelly-model.js');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = (userId) => {
  logger.info('Starting Fuelly');

  appConfig
    .get(userId)
    .then((config) => {
      const defer = Q.defer();

      const promiseArr = [];
      const numVehicles = config && config.fuelly && config.fuelly.vehicles && config.fuelly.vehicles.length;

      if (!numVehicles) {
        defer.reject('No vehicles');
      } else {
        for (let i = 0, x = numVehicles; i < x; i += 1) {
          const vehicleConf = config.fuelly.vehicles[i];
          promiseArr.push(carData(vehicleConf, userId));
        }
      }

      Q.all(promiseArr)
        .then(() => {
          defer.resolve();
        })
        .then(() => {
          logger.info('Done getting Fuelly data');
        })
        .catch((err) => {
          logger.error(err);
        });

      return defer.promise;
    })
    .catch((err) => {
      logger.error(err);
    });
};

function carData(config, userId) {
  const defer = Q.defer();
  const url = config && config.url;

  if (!url) {
    defer.reject('Missing fuelly config');
  } else {
    api
      .get({ url })
      .then((body) => {
        try {
          const data = [];
          parseString(body, (err, result) => {
            if (err) {
              return defer.reject(err);
            }

            const entries = result.rss.channel[0].item;

            if (entries && entries.length) {
              for (let i = 0, x = entries.length; i < x; i += 1) {
                const desc = entries[i].description[0];

                const milesIndex = desc.indexOf('Miles:');
                const milesBreak = desc.indexOf('<br />', milesIndex);
                const miles = parseFloat(desc.substring(milesIndex + 7, milesBreak));

                const gallonsIndex = desc.indexOf('Gallons:');
                const gallonsBreak = desc.indexOf('<br />', gallonsIndex);
                const gallons = parseFloat(desc.substring(gallonsIndex + 9, gallonsBreak));

                const priceIndex = desc.indexOf('Price: $');
                let price = 0;
                if (priceIndex > -1) {
                  price = parseFloat(desc.substring(priceIndex + 8, priceIndex + 12));
                }

                const fillTime = entries[i].pubDate[0];

                data.push({ fillTime, miles, gallons, price, name: config.name });
              }
            } else {
              defer.reject(`No fuel data from fuelly for ${config.name}`);
            }
          });

          const saveArray = [];

          for (let j = 0, x = data.length; j < x; j += 1) {
            saveArray.push(save(data[j], userId));
          }

          Q.all(saveArray)
            .then(() => {
              defer.resolve();
            })
            .catch((err) => {
              defer.reject(err);
            });
        } catch (err) {
          defer.reject(err);
        }
      })
      .catch((err) => {
        logger.error(err);
        defer.reject('Get fuelly data error');
      });
  }

  return defer.promise;
}

function save(data, userId) {
  const defer = Q.defer();

  const filter = {
    name: data.name,
    fillTime: data.fillTime,
    userId,
  };

  fuellyModel
    .findOne(filter, {}, { sort: { _id: -1 } })
    .lean()
    .then((oldData) => {
      // If fillTime already exists in DB, do not save duplicate data
      if (!oldData) {
        const doc = new fuellyModel({ ...data, userId });
        return doc.save();
      }
      defer.resolve(); // Data already exists
    })
    .catch((err) => {
      defer.reject(err);
    });

  return defer.promise;
}
