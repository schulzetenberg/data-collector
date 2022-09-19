const AllocationModel = require('../models/allocation-model');
const appConfig = require('./app-config');
const api = require('./api');

exports.save = (userId) =>
  appConfig
    .app(userId, 'allocation')
    .then((allocationConfig) => {
      if (!allocationConfig || !allocationConfig.list) {
        return Promise.reject('Allocation config missing');
      }

      const getFund = ({ ticker, value }) =>
        api
          .get({
            // eslint-disable-next-line max-len
            url: `https://api.vanguard.com/rs/ire/01/ind/fund/${ticker}/profile.jsonp?callback=angular.callbacks._0`,
            headers: { Referer: 'https://investor.vanguard.com/' },
          })
          .then((data) => ({ data, ticker, value }));

      const promises = [];

      allocationConfig.list.forEach((x) => {
        if (x.isStock && x.label) {
          const ticker = x.label.toUpperCase();
          promises.push(getFund({ ticker, value: x.value }));
        }
      });

      return Promise.all(promises).then((data) => {
        const returnData = [];

        data.forEach((x) => {
          let parsedData = x.data.slice(21); // Remove 'angular.callbacks._0(' from start of string
          parsedData = parsedData.substring(0, parsedData.length - 1); // Remove ')' from end of string
          const jsonData = JSON.parse(parsedData);

          returnData.push({ fund: jsonData, ticker: x.ticker, value: x.value });
        });

        return returnData;
      });
    })
    .then((data) => {
      const getStocks = ({ fund, ticker, value }) =>
        api
          .get({
            // eslint-disable-next-line max-len
            url: `https://investor.vanguard.com/investment-products/etfs/profile/api/${ticker}/portfolio-holding/stock`,
            headers: {
              Referer: `https://investor.vanguard.com/investment-products/etfs/profile/${ticker}`,
              'user-agent':
                // eslint-disable-next-line max-len
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            },
          })
          .then((stocks) => {
            if (stocks.size > 500) {
              console.log(`I am only taking the top 500. Ignoring the bottom ${stocks.size - 500} of funds.`);
            }

            return {
              fund,
              ticker,
              value,
              stocks: stocks.size < 1 ? [] : stocks.fund.entity,
            };
          });

      const getBonds = ({ fund, ticker, value, stocks }) =>
        api
          .get({
            // eslint-disable-next-line max-len
            url: `https://investor.vanguard.com/investment-products/etfs/profile/api/${ticker}/portfolio-holding/bond`,
            headers: {
              Referer: `https://investor.vanguard.com/investment-products/etfs/profile/${ticker}`,
              'user-agent':
                // eslint-disable-next-line max-len
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
            },
          })
          .then((bonds) => {
            if (bonds.size > 500) {
              console.log(`I am only taking the top 500. Ignoring the bottom ${bonds.size - 500} of funds.`);
            }

            return {
              fund,
              ticker,
              value,
              stocks,
              bonds: bonds.size < 1 ? [] : bonds.fund.entity,
            };
          });

      const promises = [];
      data.forEach((fundData) => {
        promises.push(getStocks(fundData).then(getBonds));
      });

      return Promise.all(promises);
    })
    .then((data) => {
      const totalValue = data.reduce((partialSum, a) => partialSum + (a.value ? a.value : 0), 0);
      const totalPortfolio = [];

      const addToArray = (x, fundValue) => {
        const existingIndex = totalPortfolio.findIndex((i) => i.ticker === x.ticker);

        if (existingIndex !== -1) {
          totalPortfolio[existingIndex].percent += (x.percentWeight * fundValue) / totalValue;
        } else {
          totalPortfolio.push({
            ticker: x.ticker,
            label: x.longName,
            percent: (x.percentWeight * fundValue) / totalValue,
          });
        }
      };

      data.forEach((x) => {
        x.stocks.forEach((s) => {
          addToArray(s, x.value);
        });

        x.bonds.forEach((b) => {
          addToArray(b, x.value);
        });
      });

      const sortByPercentDesc = (a, b) => {
        if (a.percent > b.percent) {
          return -1;
        }

        if (a.percent < b.percent) {
          return 1;
        }

        return 0;
      };

      totalPortfolio.sort(sortByPercentDesc);

      const doc = new AllocationModel({
        userId,
        portfolio: data,
        totalValue,
        totalPortfolio,
      });

      return doc.save();
    });
