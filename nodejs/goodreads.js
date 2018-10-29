const parseString = require('xml2js').parseString;
const Q = require('q');
const cheerio = require('cheerio');

const logger = require('./log');
const goodreadsModel = require('../models/goodreads-model');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = function() {
  logger.info('Starting Goodreads');

  appConfig
    .get()
    .then(booksRead)
    .then(topBooks)
    .then(save)
    .then(function() {
      logger.info('Finished saving Goodreads data');
    })
    .catch(function(err) {
      logger.error(err);
    });
};

function booksRead(config) {
  const defer = Q.defer();

  const id = config && config.goodreads && config.goodreads.id;
  const key = config && config.goodreads && config.goodreads.key;

  if (!id || !key) {
    defer.reject('Missing goodreads config');
  } else {
    const url = `https://www.goodreads.com/review/list/${id}?format=xml&key=${key}&sort=shelves&v=2&shelf=read&sort=date_read&per_page=200`;

    api
      .get({ url })
      .then(function(body) {
        try {
          var promises = [];

          parseString(body, function(err, result) {
            if (err) return defer.reject(err);

            let books = result.GoodreadsResponse.reviews[0].review;

            for (let i = 0; i < books.length; i++) {
              const book = books[i].book[0];
              // Replace m with l to view large photo
              // ex. 1405392994m --> 1405392994l
              // http://d2arxad8u2l0g7.cloudfront.net/books/1405392994m/18595312.jpg
              let img = book.image_url[0];
              let imgSplit = img.split('/');
              if (imgSplit.length === 6) {
                imgSplit[4] = imgSplit[4].replace('m', 'l');
                img = imgSplit.join('/');
              }

              const ret = {
                title: book.title[0],
                img: img,
                pages: book.num_pages[0],
                link: book.link[0],
                dateRead: books[i].read_at && new Date(books[i].read_at[0]),
                rating: books[i].rating && parseInt(books[i].rating[0]),
                // NOTE: Currently not being used, but could be useful in the future
                readCount: books[i].read_count && parseInt(books[i].read_count[0]),
              };

              promises.push(getPhoto(ret));
            }
          });

          Q.all(promises)
            .then(function(data) {
              defer.resolve({
                booksRead: data,
                config: config,
              });
            })
            .catch(function(err) {
              defer.reject(err);
            });
        } catch (err) {
          defer.reject(err);
        }
      })
      .catch(function(err) {
        logger.error(err);
        defer.reject('Get Goodreads read books error');
      });
  }

  return defer.promise;
}

/* If image not returned from Goodreads API, get the image from the webpage */
function getPhoto(data) {
  const defer = Q.defer();

  // Need to get the image from Goodreads url
  if (data.img.indexOf('nophoto') > 0) {
    const config = {
      url: data.link,
      headers: {
        ACCEPT: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      },
    };

    api
      .get(config)
      .then(function(html) {
        const $ = cheerio.load(html);
        const src = $('#coverImage').attr('src');
        if (src) data.img = src;
        defer.resolve(data);
      })
      .catch(function(err) {
        logger.error(err);
        defer.reject('Get Goodreads img error for url: ' + data.link);
      });
  } else {
    defer.resolve(data); // Image url from API is fine, do nothing
  }

  return defer.promise;
}

function topBooks(params) {
  const defer = Q.defer();

  const id = params && params.config && params.config.goodreads && params.config.goodreads.id;
  const key = params && params.config && params.config.goodreads && params.config.goodreads.key;

  if (!id || !key) {
    defer.reject('Missing goodreads config');
  } else {
    const url = `https://www.goodreads.com/review/list/${id}?format=xml&key=${key}&sort=shelves&v=2&shelf=read&sort=date_read&per_page=200`;

    api
      .get({
        url,
      })
      .then(function(body) {
        try {
          var topBooks = [];

          parseString(body, function(err, result) {
            if (err) return defer.reject(err);

            const books = result.GoodreadsResponse.reviews[0].review;

            for (let i = 0; i < books.length; i++) {
              // Save 6 of the most recently read books rated 5 stars
              if (topBooks.length < 6 && books[i].rating[0] == 5) {
                // Replace m with l to view large photo
                // ex. 1405392994m --> 1405392994l
                // http://d2arxad8u2l0g7.cloudfront.net/books/1405392994m/18595312.jpg
                let img = books[i].book[0].image_url[0];
                let imgSplit = img.split('/');
                if (imgSplit.length === 6) {
                  imgSplit[4] = imgSplit[4].replace('m', 'l');
                  img = imgSplit.join('/');
                }

                topBooks.push({
                  title: books[i].book[0].title[0],
                  link: books[i].book[0].link[0],
                  img: img,
                });
              }
            }
          });

          let saveData = {
            booksRead: params.booksRead,
            topBooks: topBooks,
          };
          defer.resolve(saveData);
        } catch (err) {
          defer.reject(err);
        }
      })
      .catch(function(err) {
        logger.error(err);
        defer.reject('Get Goodreads ratings error');
      });
  }

  return defer.promise;
}

function save(data) {
  var doc = new goodreadsModel(data);
  return doc.save();
}
