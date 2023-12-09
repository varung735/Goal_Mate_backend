const express = require('express');
const { UserSignUp, UserLogIn, ForgetPassword, ResetPassword, SendEmailVerificationToken, VerifyEmail } = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.post('/signup', UserSignUp);
userRouter.post('/login', UserLogIn);
userRouter.post('/forget/password', ForgetPassword);
userRouter.post('/reset/password', ResetPassword);
userRouter.post('/verify/email/send_link', SendEmailVerificationToken);
userRouter.get('/verify/email', VerifyEmail);

module.exports = userRouter;