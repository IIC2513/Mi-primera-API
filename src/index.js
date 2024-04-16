// src/index.js
const Koa = require('koa');
const Logger = require('koa-logger');

const app = new Koa();

app.use(Logger());

app.use((ctx, next) => {
  ctx.body = 'Hola mundo';
});

app.listen(3000);
