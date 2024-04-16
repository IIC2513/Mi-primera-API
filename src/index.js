// src/index.js
const Koa = require('koa');
const Logger = require('koa-logger');
const router = require('./routes');

const app = new Koa();

app.use(Logger());

app.use(router.routes());

app.listen(3000);
