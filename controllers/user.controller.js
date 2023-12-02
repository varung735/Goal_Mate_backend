const userModel = require('../schemas/user.schema');
const asyncHandler = require('../utils/asyncHandler');
const CustomError = require('../utils/customError');
const cookieOptions = require('../utils/cookieOptions');

/*
@UserSignUp

@routes
local - http://localhost:4000/api/v1/users/signup
prod - https://goalmate.render.app/api/v1/users/signup

**description - This function will take the userdata from req.body and send verification link to the email

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