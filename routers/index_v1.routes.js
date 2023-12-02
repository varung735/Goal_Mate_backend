const express = require('express');
const userRouter = require('./user.routes');

const indexV1Router = express.Router();

indexV1Router.use('/users', userRouter);

module.exports = indexV1Router;