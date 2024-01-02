const express = require('express');
const isLoggedIn = require('../middlewares/auth.middleware');
const { GetCurrentTaskGroups, AddTaskGroup, EditTaskGroup, DeleteTaskGroup, AddTaskToGroup, EditTaskInGroup, DeleteTaskInGroup, GetDistinctDates } = require('../controllers/task.controller');

const taskRouter = express.Router();

taskRouter.get('/group/get', isLoggedIn, GetCurrentTaskGroups);
taskRouter.post('/group/add', isLoggedIn, AddTaskGroup);
taskRouter.put('/group/edit', isLoggedIn, EditTaskGroup);
taskRouter.get('/group/get/dates', isLoggedIn, GetDistinctDates);
taskRouter.delete('/group/delete', isLoggedIn, DeleteTaskGroup);
taskRouter.patch('/group/task/add', isLoggedIn, AddTaskToGroup);
taskRouter.patch('/group/task/edit', isLoggedIn, EditTaskInGroup);
taskRouter.patch('/group/task/delete', isLoggedIn, DeleteTaskInGroup);

module.exports = taskRouter;