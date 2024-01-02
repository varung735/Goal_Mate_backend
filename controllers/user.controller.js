const userModel = require('../schemas/user.schema');
const folderSchema = require('../schemas/folder.schema');
const asyncHandler = require('../utils/asyncHandler');
const CustomError = require('../utils/customError');
const cookieOptions = require('../utils/cookieOptions');
const mailHelper = require('../services/mailHelper');

/*
@UserSignUp

@routes
local - http://localhost:4000/api/v1/users/signup
prod - https://goalmate.render.app/api/v1/users/signup

**description - This function will take the userdata from req.body and save it into DB

@parameters - name, email, password

@returns - user object
*/
exports.UserSignUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password){
        throw new CustomError("One of the fields missing", 401);
    }

    const existingUser = await userModel.findOne({ email });

    if(existingUser !== null){
        throw new CustomError("User already Exists", 401);
    }

    const user = await userModel.create({
        name: name,
        email: email,
        password: password
    });

    const folder = await folderSchema.create({
        userId: user._id,
        folder_name: 'Main'
    });

    const token = await user.generateJwtToken();
    user.password = undefined;

    res.clearCookie('token');
    res.cookie('token', token, cookieOptions);

    res.status(200).json({
        success: true,
        message: "User Signed Up Successfully",
        user
    });
});

/*
@UserLogIn

@routes
local - http://localhost:4000/api/v1/users/login
prod - https://goalmate.render.com/api/v1/users/login

**description - This function will take the email and password from the req.body and authenticate them.

@parameters - email, password

@returns - success or failure message
*/
exports.UserLogIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password){
        throw new CustomError("Email or Password is missing", 401);
    }

    const user = await userModel.findOne({ email: email }, '+password');

    if(user === null){
        throw new CustomError("User Not Found", 404);
    }

    const PasswordMatch = await user.comparePassword(password);

    if(PasswordMatch){
        const token = await user.generateJwtToken();
        user.password = undefined;
        
        res.clearCookie('token');
        res.cookie('token', token, cookieOptions);
    
        res.status(200).json({
            success: true,
            message: "User LoggedIn Successfully",
            user
        });
    }
    else{
        throw new CustomError("Invalid Credentials", 403);
    }
});

/*
@ForgetPassword

@method - GET

@route
local - http://localhost:4000/api/v1/users/forget/password
prod - https://goalmate.render.app/api/v1/users/forget/password

**description - this function will verify the change password link to email 

@parameters - email

@returns - success or failure message
*/
exports.ForgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.query;

    if(!email){
        throw new CustomError('Email is missing', 401);
    }

    const user = await userModel.findOne({ email: email });

    if(user === null){
        throw new CustomError('User Not Found', 404);
    }

    const token = user.generateForgetPasswordToken();

    user.forgetPasswordToken = token;

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/users/reset/password?token=${token}`;
    const text = `Click on this Url to reset your password\n${resetPasswordUrl}`;

    try {
        await mailHelper({
            email: email,
            subject: 'Forgot Password',
            text
        });

        res.status(200).json({
            success: true,
            message: `Forgot Password Url sent to ${email}`
        });
    } catch (error) {
        user.forgetPasswordToken = undefined;
        user.forgetPasswordExpiry = undefined;

        await user.save({ validateBeforeSave: false });

        console.log(error);
        throw new CustomError(error.message || 'Cannot Send Password Reset Link', 500);
    }
});

/*
@ResetPassword

@method - POST

@route
local - http://localhost:4000/api/v1/users/reset/password
prod - https://goalmate.render.app/api/v1/users/reset/password

**description
This function would verify the token and check if token has expired or not, if the token is valid and not expired, then let the user
change the password

@parameters - password

@returns - success or failure message
*/
exports.ResetPassword = asyncHandler(async (req, res) => {
    const { token } = req.query;
    const { password } = req.body;

    if(!token) {
        throw new CustomError('Reset Token Not Found', 404);
    }

    if(!password){
        throw new CustomError('Password is Missing', 404);
    }

    const user = await userModel.findOne({ 
        forgetPasswordToken: token,
        forgetPasswordExpiry: { $gt: Date.now() }
    });

    if(!user){
        throw new CustomError('Password Token Invalid or Expires', 400);
    }

    user.password = password;
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password Reset Successfully'
    });
});

/*
@SendEmailVerificationLink

@method - GET

@route
local - http://localhost:4000/api/v1/users/verify/email/send_link
prod - https://goalmate.render.app/api/v1/users/verify/email/send_link

**description - This function would send a link to verify your email

@parameters - email

@returns - success or failure response
*/
exports.SendEmailVerificationToken = asyncHandler(async (req, res) => {
    const { email } = req.query;

    const user = await userModel.findOne({ email: email });

    if(user === null){
        throw new CustomError('User Not Found', 404);
    }

    const token = user.generateEmailVerificationToken();
    const otp = user.generateEmailVerificationOtp();

    user.emailVerificationToken = token;
    user.emailVerificationOtp = otp;
    
    await user.save({ validateBeforeSave: false });

    const verificationUrl = `${req.protocol}://${req.get("host")}/api/v1/users/email/verify?token=${token}`;
    const text = `Click in this url to verify your email\n${verificationUrl}\nenter this OTP: ${otp} to complete verification`;

    try {
        await mailHelper({
            email: email,
            subject: 'Verify Your Email',
            text
        });

        res.status(200).json({
            success: true,
            message: `Mail sent at ${email} for verification`
        });
    } catch (error) {
        user.emailVerificationToken = undefined;
        user.emailTokenExpiry = undefined;

        await user.save({ validateBeforeSave: false });

        console.log(error);
        throw new CustomError('Error While Sending Mail', 500);
    }
});

/*
@VerifyEmail

@route
local - http://localhost:4000/api/v1/users/verify/email?token=token_value&otp=otp_value
prod - https://goalmate.render.app/api/v1/users/verify/email?token=token_value&otp=otp_value

**description
This function will verify the email verification token received from the user and verify the email

@paramters - token, otp

@returns - success or failure message
*/
exports.VerifyEmail = asyncHandler(async (req, res) => {
    const { token, otp } = req.query;

    if(!token || !otp){
        throw new CustomError('token or otp is missing', 404);
    }

    const user = await userModel.findOne({
        emailVerificationToken: token,
        emailTokenExpiry: { $gt: Date.now() }
    });

    if(!user){
        throw new CustomError('Token Invalid or expired', 400);
    }

    if(user.emailVerificationOtp !== otp){
        throw new CustomError('Invalid Otp', 403);
    }

    user.emailVerificationToken = undefined;
    user.emailTokenExpiry = undefined;
    user.emailVerificationOtp = undefined;

    user.isEmailVerified = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Email Verified Successfully'
    });
});