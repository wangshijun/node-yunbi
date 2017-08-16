# 云币网 Node.js SDK

> Node.js client for https://yunbi.com API

## Installation

```
yarn add yunbi2   # npm i -S yunbi2
```

## Documentation

```
const YunbiClient = require('yunbi2');
const client = new YunbiClient({
  accessKey: '<your accessKey>',
  secretKey: '<your secretKey>',
});
```

### Callback Style

支持回调调用方式

```
(async () => {
  const orders = await client.getMyOrdersAsync({ market: 'btccny' });
  const trades = await client.getMyTradesAsync({ market: 'eoscny', limit: 5 });
  const deposits = await client.getMyDepositsAsync({ limit: 5 });
  const profile = await client.getMyProfileAsync({});
  const order = await client.createOrderAsync({ volume: 2, market: 'sccny', side: 'buy' });
  console.log({ orders, trades, deposits, profile: profile.accounts, order });
})();
```

### Async Style

支持 Async 调用方式

```
(async () => {
  const orders = await client.getMyOrdersAsync({ market: 'btccny' });
  const trades = await client.getMyTradesAsync({ market: 'eoscny', limit: 5 });
  const deposits = await client.getMyDepositsAsync({ limit: 5 });
  const profile = await client.getMyProfileAsync({});
  const order = await client.createOrderAsync({ volume: 2, market: 'sccny', side: 'buy' });
  console.log({ orders, trades, deposits, profile: profile.accounts, order });
})();
```

### API List

#### getMyOrdersAsync

## Contribution
