// src/routes/index.js
const Router = require('koa-router');
const movies = require('./movies');

const router = new Router();
router.use('/movies', movies.routes());

module.exports = router;
