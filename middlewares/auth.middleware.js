const userModel = require('../schemas/user.schema');
const Jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const CustomError = require('../utils/customError');
const config = require('../config/enviornment.config');

const isLoggedIn = asyncHandler(async (req, res, next) => {
    let token;

    if(req.cookies.token || req.headers.authorization.startsWith('Bearer')){
        token = req.cookies.token || req.headers.authorization.split(' ')[1];
    }

    if(!token){
        throw new CustomError('Unauthorized access of route', 403);
    }

    try {
        const decodedToken = Jwt.decode(token, config.jwt_secret);

        req.user = await userModel.findById(decodedToken._id, 'name email role');
        next();
    } catch (error) {
        console.log(error);
        throw new CustomError('Token Invalid or Malformed', 403);
    }
});

module.exports = isLoggedIn;