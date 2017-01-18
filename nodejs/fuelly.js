var request = require('request');
var parseString = require('xml2js').parseString;
var Q = require('q');

var fuellySchema = require('../models/fuelly-schema.js');
var appConfig = require('./app-config');

exports.save = function() {
  console.log("Starting Fuelly");

  appConfig.get().then(carData).catch(function(err){
    console.log(err);
  });

};

function carData(config){
  var defer = Q.defer();

  var url = config && config.fuelly && config.fuelly.url;

  if(!url){
    defer.reject("Missing fuelly config");
  } else {
    request(url, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.log(error);
          defer.reject("Get fuelly data error");
      } else {
        try {
          var data = [];
          parseString(body, function (err, result) {
            if (err) return defer.reject(err);

            var entries = result.rss.channel[0].item;

            for(var i=0, x=entries.length; i < x; i++){
              var desc = entries[i].description[0];

              var milesIndex = desc.indexOf('Miles:');
              var milesBreak =  desc.indexOf('<br />', milesIndex);
              var miles = parseFloat(desc.substring(milesIndex + 7, milesBreak));

              var gallonsIndex = desc.indexOf('Gallons:');
              var gallonsBreak =  desc.indexOf('<br />', gallonsIndex);
              var gallons = parseFloat(desc.substring(gallonsIndex + 9, gallonsBreak));

              var priceIndex = desc.indexOf('Price: $');
              var price = 0;
              if(priceIndex > -1) {
                price = parseFloat(desc.substring(priceIndex + 8, priceIndex + 12));
              }

              var fillTime = entries[i].pubDate[0];

              data.push({ fillTime, miles, gallons, price });
            }
          });

          var saveArray = [];
          for(var j=0, x=data.length; j<x; j++){
            saveArray.push(save(data[j]));
          }
          Q.all(saveArray).then(function(){
              defer.resolve();
          }).catch(function(err){
            defer.reject(err);
          })
        } catch(err){
          defer.reject(err);
        }
      }
    });
  }

  return defer.promise;
}

function save(data) {
  var defer = Q.defer();

  // If fillTime already exists in DB, do not save duplicate data
  fuellySchema.findOne({"fillTime" : data.fillTime}, {}, {sort: { '_id' : -1 }}).lean().exec(function (err, oldData){
    if (err) defer.reject(err);
    if(!oldData){
      var doc = new fuellySchema(data);
      doc.save(function(err) {
        if (err) {
          defer.reject(err);
        } else {
          console.log("Saved Fuelly data");
          defer.resolve();
        }
      });
    }
  });

  return defer.promise;
}
