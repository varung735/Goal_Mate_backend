const express = require('express');
const userRouter = require('./user.routes');
const expenseRouter = require('./expense.routes');

const indexV1Router = express.Router();

indexV1Router.use('/users', userRouter);
indexV1Router.use('/expenses', expenseRouter);

module.exports = indexV1Router;