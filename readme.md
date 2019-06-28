# f1-2019-packets

## install

```
yarn add f1-2019-packets
```

## use

```js
const dgram = require('dgram');
const decode = require('f1-2019-packets');

const server = dgram.createSocket('udp4');

server.on('error', err => {
  console.log(`server error:\n${err.stack}`);
  server.close();
});

server.on('message', msg => {
  console.log(decode(msg));
});

server.on('listening', () => {
  socket.setBroadcast(true);
  const address = server.address();
  console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(20777);
```

## license

MIT
