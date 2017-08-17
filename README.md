# Node.js SDK for https://yunbi.com API

> for detail info please read [documentation](https://yunbi.com/swagger/#/) and [guide](https://yunbi.com/documents/api/guide)

## Installation

```
yarn add yunbi2   # npm i -S yunbi2
```

## Documentation

```javascript
const YunbiClient = require('yunbi2');
const client = new YunbiClient({
  accessKey: '<your accessKey>',
  secretKey: '<your secretKey>',
});
```

### callback style

```javascript
// 遵循 node.js 中的 [error first callback](http://www.codingdefined.com/2015/10/what-are-error-first-callbacks-in-nodejs.html) 风格
client.getMarkets({}, (err, data) => {
  console.log({ action: 'getMarkets', err, data });
});
```

### async style

```javascript
// 使用 async/await 时记得用 try/catch 处理错误
(async () => {
  try {
    const markerts = await client.getMarketsAsync({});
    console.log({ action: 'getMarketAsync', markets });
  } catch (err) {
    console.trace(err);
  }
})();
```

### API List

### callback style

* getMarkets({}, callback)，获取所有支持交易的币种
* getTickers({}, callback)，获取所有交易币种的当前价
* getTickersByMarket({ market: 'eoscny' }, callback)，获取某个交易币种的当前价
* getK({ market: 'btccny' }, callback)，获取某个币种的 K线数据
* getServerTime({}, callback)，获取服务器时间戳，毫秒级
* getOrders({ market: 'btccny' }, callback)，获取某个币种的最新挂单数据
* getTrades({ market: 'btccny' }, callback)，获取某个币种的最新成交列表
* getMyOrders({ market: 'btccny' }, callback)，获取某个币种下的所有挂单，实际是未成交的
* getMyTrades({ market: 'eoscny' }, callback)，获取某个币种下的所有成交，实际就是你的买入和卖出
* getMyDeposits({}, callback)，获取账户的转账和提现记录
* getMyProfile({}, callback)，获取当前用户及账户余额信息
* createOrder({ market: 'btccny', side: 'buy', volume: 0.1, price: 20000, ord_type: 'limit' }, callback)，挂单，可指定挂单类型、价格、数量、币种
* cancelOrder({ id: 1234 }, callback)，撤单

### async style

**注意：部分没有参数的 API 以 async 方式调用时需要指定参数为空对象，否则会出错。**

* getMarketsAsync({})，获取所有支持交易的币种
* getTickersAsync({})，获取所有交易币种的当前价
* getTickersByMarketAsync({ market: 'eoscny' })，获取某个交易币种的当前价
* getKAsync({ market: 'btccny' })，获取某个币种的 K线数据
* getServerTimeAsync({})，获取服务器时间戳，毫秒级
* getOrdersAsync({ market: 'btccny' })，获取某个币种的最新挂单数据
* getTradesAsync({ market: 'btccny' })，获取某个币种的最新成交列表
* getMyOrdersAsync({ market: 'btccny' })，获取某个币种下的所有挂单，实际是未成交的
* getMyTradesAsync({ market: 'eoscny' })，获取某个币种下的所有成交，实际就是你的买入和卖出
* getMyDepositsAsync({})，获取账户的转账和提现记录
* getMyProfileAsync({})，获取当前用户及账户余额信息
* createOrderAsync({ market: 'btccny', side: 'buy', volume: 0.1, price: 20000, ord_type: 'limit' })，挂单，可指定挂单类型、价格、数量、币种
* cancelOrderAsync({ id: 1234 })，撤单

## Contribution

Issues and Pull Requests are welcome!

Happy Hacking!

## License

[MIT](./LICENSE)
