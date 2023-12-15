const express = require('express');
const userRouter = require('./user.routes');
const expenseRouter = require('./expense.routes');
const taskRouter = require('./task.routes');

const indexV1Router = express.Router();

indexV1Router.use('/users', userRouter);
indexV1Router.use('/expenses', expenseRouter);
indexV1Router.use('/tasks', taskRouter);

module.exports = indexV1Router;