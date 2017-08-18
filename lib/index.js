const url = require('url');
const qs = require('querystring');
const crypto = require('crypto');
const promisify = require('pify');
const request = require('request');
const debug = require('debug')('yunbi2');

const BASE_URL = 'https://yunbi.com//api/v2';

function Client(config = {}) {
  const { accessKey = '', secretKey = '', baseUrl = BASE_URL } = config;
  this.accessKey = accessKey;
  this.secretKey = secretKey;
  this.baseUrl = baseUrl;
  debug('init client', { accessKey, secretKey, baseUrl });
}

// 计算请求参数
Client.prototype.getRequestParams = function (endpoint, args = {}) {  // eslint-disable-line
  // 校验必须的参数
  if (Array.isArray(endpoint.requiredArgs)) {
    endpoint.requiredArgs.forEach((key) => {
      if (!args[key]) {
        throw new Error(`${key} is required to call api endpoint`);
      }
    });
  }

  // 基础请求参数
  const params = { method: endpoint.method || 'get', json: true };
  if (typeof endpoint.url === 'function') {
    params.url = `${this.baseUrl}${endpoint.url(args)}`;
  } else {
    params.url = `${this.baseUrl}${endpoint.url}`;
  }

  // 必要的时候做请求签名
  if (endpoint.secure) {
    if (!this.accessKey || !this.secretKey) {
      throw new Error('both accessKey and secretKey are required to call signed endpoint');
    }

    args.access_key = this.accessKey;
    args.tonce = Date.now();

    const verb = params.method.toUpperCase();
    const uri = url.parse(params.url).path.replace('//', '/');
    const query = Object.keys(args).sort().map(k => `${k}=${args[k]}`).join('&');
    const payload = `${verb}|${uri}|${query}`;
    const hmac = crypto.createHmac('sha256', this.secretKey);
    hmac.update(payload);
    args.signature = hmac.digest('hex');
    debug('secure request', { verb, uri, query, payload, signature: args.signature });
  }

  // 把参数拼接到 URL 中或者放在 body 中
  if (params.method === 'get' && Object.keys(args).length) {
    params.url = `${params.url}?${qs.stringify(args)}`;
  }
  if (params.method === 'post') {
    params.formData = args;
  }

  return params;
};

// 方法集合
const endpoints = {
  getMarkets: {
    url: '/markets.json',
  },
  getTickers: {
    url: '/tickers.json',
  },
  getTickersByMarket: {
    url: args => `/tickers/${args.market}.json`,
  },
  getK: {
    requiredArgs: ['market'],
    url: '/k.json',
  },
  getServerTime: {
    url: '/timestamp.json',
  },
  getKWithPendingTrades: {
    url: '/k_with_pending_trades.json',
  },
  getTrades: {
    requiredArgs: ['market'],
    url: '/trades.json',
  },
  getOrders: {
    requiredArgs: ['market'],
    url: '/order_book.json',
  },
  getMyOrders: {
    secure: true, // 需要签名
    requiredArgs: ['market'],
    url: '/orders.json',
  },
  getMyTrades: {
    secure: true,
    requiredArgs: ['market'],
    url: '/trades/my.json',
  },
  getMyDeposits: {
    secure: true,
    optionalArgs: ['currency', 'limit', 'state'],
    url: '/deposits.json',
  },
  getMyProfile: {
    secure: true,
    url: '/members/me.json',
  },
  createOrder: {
    method: 'post',
    secure: true,
    requiredArgs: ['market', 'side', 'volume'],
    optionalArgs: ['price', 'ord_type'],
    url: '/orders.json',
  },
  cancelOrder: {
    method: 'post',
    secure: true,
    requiredArgs: ['id'],
    url: '/orders/delete.json',
  },
};

// 在原型链上生成方法
Object.keys(endpoints).forEach((key) => {
  Client.prototype[key] = function (args = {}, done) {  // eslint-disable-line
    const params = this.getRequestParams(endpoints[key], Object.assign({}, args));
    request(params, (err, res, data) => {
      debug('request complete', { args, params, err, data, status: res.statusCode, headers: res.headers });
      if (res.statusCode !== 200) {
        done(new Error('server error: non 2xx status code'));
      } else {
        done(err, data);
      }
    });
  };

  Client.prototype[`${key}Async`] = promisify(Client.prototype[key]);
});

module.exports = Client;
