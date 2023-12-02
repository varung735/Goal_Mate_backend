const express = require('express');
const { UserSignUp, UserLogIn } = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.post('/signup', UserSignUp);
userRouter.post('/login', UserLogIn);

module.exports = userRouter;