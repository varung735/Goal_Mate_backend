const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const config = require('../config/enviornment.config');
const authRoles = require('../utils/authRoles');
const generateRandomChars = require('../services/generateRandomChars');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        email: {
            type: String,
            unique: [true, 'Email must be unique'],
            required: [true, 'Email is required']
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [10, 'Password must be of 10 chars minimum'],
            select: false
        },
        role: {
            type: String,
            enum: Object.values(authRoles),
            default: authRoles.user
        },
        forgetPasswordToken: String,
        forgetPasswordExpiry: Date
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function(next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods = {
    comparePassword: async function(enteredPassword) {
        return await bcrypt.compare(enteredPassword, this.password);
    },
    generateJwtToken: async function() {
        return JWT.sign(
            {
                _id: this._id,
                email: this.email,
                role: this.role
            },
            config.jwt_secret,
            {
                expiresIn: config.jwt_expiry
            }
        );
    },
    generateForgetPasswordString: function() {
        const forgotPassToken = generateRandomChars(20);

        this.forgetPasswordToken = forgotPassToken;
        this.forgetPasswordExpiry = Date.now() + 30 * 60 * 1000;

        return forgotPassToken;
    }
};

module.exports = mongoose.model('User', userSchema);