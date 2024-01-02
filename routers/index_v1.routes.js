const express = require('express');
const userRouter = require('./user.routes');
const expenseRouter = require('./expense.routes');
const taskRouter = require('./task.routes');
const journalRouter = require('./journal.routes');
const folderRouter = require('./folder.routes');

const indexV1Router = express.Router();

indexV1Router.use('/users', userRouter);
indexV1Router.use('/expenses', expenseRouter);
indexV1Router.use('/tasks', taskRouter);
indexV1Router.use('/journals', journalRouter);
indexV1Router.use('/folders', folderRouter);

module.exports = indexV1Router;