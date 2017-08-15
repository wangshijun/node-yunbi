const crypto = require('crypto');
const promisify = require('pify');
const request = require('request');
const debug = require('debug')('yunbi2');

const BASE_URL = 'https://yunbi.com//api/v2';

function Client(params = {}) {
  const { accessKey = '', secretKey = '', baseUrl = BASE_URL } = params;
  this.accessKey = accessKey;
  this.secretKey = secretKey;
  this.baseUrl = baseUrl;
  debug('init client', { accessKey, secretKey, baseUrl });
}

// 计算请求参数
Client.prototype.getRequestParams = function (endpoint, args = {}) {
  const params = { method: endpoint.method };
  if (typeof endpoint.url === 'function') {
    params.url = `${this.baseUrl}${endpoint.url(args)}`;
  } else {
    params.url = `${this.baseUrl}${endpoint.url}`;
  }

  return Object.assign(params, args);
};

// 方法集合
const endpoints = {
  markets: {
    method: 'get',
    secure: false, // 是否需要签名
    url: () => '/markets.json',
  },
  tickers: {
    method: 'get',
    secure: false,
    url: () => '/tickers.json',
  },
  tickersByMarket: {
    method: 'get',
    secure: false,
    url: market => `/tickers/${market}.json`,
  },
  k: {
    method: 'get',
    secure: false,
    url: () => '/k.json',
  },
  timestamp: {
    method: 'get',
    secure: false,
    url: () => '/timestamp.json',
  },
  kWithPendingTrades: {
    method: 'get',
    secure: false,
    url: () => '/k_with_pending_trades.json',
  },
};

// 在原型链上生成方法
Object.keys(endpoints).forEach((key) => {
  Client.prototype[key] = function (args = {}, done) {  // eslint-disable-line
    const params = this.getRequestParams(endpoints[key], args);
    request(params, (err, res, data) => {
      debug('request complete', { args, params, err, data });
      done(err, data);
    });
  };

  Client.prototype[`${key}Async`] = promisify(Client.prototype[key]);
});

module.exports = Client;
