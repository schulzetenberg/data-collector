var request = require('request');
var parseString = require('xml2js').parseString;
var Q = require('q');
var cheerio = require('cheerio');

var logger = require('./log');
var goodreadsModel = require('../models/goodreads-model.js');
var appConfig = require('./app-config');

exports.save = function() {
  logger.info("Starting Goodreads");

  appConfig.get().then(booksRead).then(topBooks).then(save).catch(function(err){
    logger.error(err);
  });

};

function booksRead(config){
  var defer = Q.defer();

  var id = config && config.goodreads && config.goodreads.id;
  var key = config && config.goodreads && config.goodreads.key;
  var numDays = config && config.goodreads && config.goodreads.numDays;  //number of books read in the past amount of days
  if(!id || !key || !numDays){
    defer.reject("Missing goodreads config");
  } else {
    var pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - numDays);
    var url = "http://www.goodreads.com/review/list/" + id + "?format=xml&key=" + key + "&sort=shelves&v=2&shelf=read&sort=date_read&per_page=200";

    request(url, function (error, response, body) {
      if (error || response.statusCode !== 200) {
          defer.reject("Get Goodreads read books error");
      } else {
        try {
          var promises = [];

          parseString(body, function (err, result) {
            if (err) return defer.reject(err);

            var books = result.GoodreadsResponse.reviews[0].review;

            for (var i=0; i < books.length; i++){
              if (new Date(books[i].read_at).getTime() >= pastDate){
                // Replace m with l to view large photo
                // ex. 1405392994m --> 1405392994l
                // http://d2arxad8u2l0g7.cloudfront.net/books/1405392994m/18595312.jpg
                var img = books[i].book[0].image_url[0];
                var imgSplit = img.split('/');
                if(imgSplit.length === 6){
                  imgSplit[4] = imgSplit[4].replace("m", "l");
                  img = imgSplit.join('/');
                }

                var ret = {
                  title: books[i].book[0].title[0],
                  img: img,
                  pages: books[i].book[0].num_pages[0],
                  link: books[i].book[0].link[0]
                };
                promises.push(getPhoto(ret));
              }
            }
          });

          Q.all(promises).then(function(data){
            defer.resolve({ booksRead: data, config: config });
          }).catch(function(err){
            defer.reject(err);
          });

        } catch(err){
          defer.reject(err);
        }
      }
    });
  }

  return defer.promise;
}

/* If image not returned from Goodreads API, get the image from the webpage */
function getPhoto(data){
  var defer = Q.defer();

  if(data.img.indexOf('nophoto') > 0){
    // Need to get the image from Goodreads url
    request(data.link, function (error, response, html) {
      if (error || response.statusCode !== 200) {
        defer.reject("Get Goodreads img error");
      } else {
        var $ = cheerio.load(html);
        var src = $('#coverImage').attr("src");
        if(src) data.img = src;
        defer.resolve(data);
      }
    });
  } else {
    defer.resolve(data); // Image url from API is fine, do nothing
  }

  return defer.promise;
}

function topBooks(params){
  var defer = Q.defer();

  var id = params && params.config && params.config.goodreads && params.config.goodreads.id;
  var key = params && params.config && params.config.goodreads && params.config.goodreads.key;
  if(!id || !key){
    defer.reject("Missing goodreads config");
  } else {
    var url = "http://www.goodreads.com/review/list/" + id + "?key=" + key + "&sort=shelves&v=2&shelf=read&sort=date_read&per_page=200";

    request(url, function (error, response, body) {
      if (error || response.statusCode !== 200) {
          defer.reject("Get Goodreads ratings error");
      } else {
        try {
          var topBooks = [];

          parseString(body, function (err, result) {
            if (err) return defer.reject(err);

            var books = result.GoodreadsResponse.reviews[0].review;

            for (var i=0; i < books.length; i++){
              // Save 6 of the most recently read books rated 5 stars
              if((topBooks.length < 6) && (books[i].rating[0] == 5)){
                // Replace m with l to view large photo
                // ex. 1405392994m --> 1405392994l
                // http://d2arxad8u2l0g7.cloudfront.net/books/1405392994m/18595312.jpg
                var img = books[i].book[0].image_url[0];
                var imgSplit = img.split('/');
                if(imgSplit.length === 6){
                  imgSplit[4] = imgSplit[4].replace("m", "l");
                  img = imgSplit.join('/');
                }

                topBooks.push({
                  title: books[i].book[0].title[0],
                  link: books[i].book[0].link[0],
                  img: img
                });
              }
            }
          });

          var saveData = {
            booksRead: params.booksRead,
            topBooks: topBooks
          };
          defer.resolve(saveData);
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

  var doc = new goodreadsModel(data);
  doc.save(function(err) {
    if (err) {
      defer.reject(err);
    } else {
      logger.info("Saved GoodReads data");
      defer.resolve();
    }
  });

  return defer.promise;
}
