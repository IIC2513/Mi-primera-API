// src/routes/movies.js
const Router = require('koa-router');
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'GET /movies';
});

module.exports = router;
