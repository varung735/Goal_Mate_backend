const errorMessages = require('../utils/errorMessages');

const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.log(errorMessages.error(error.message));
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = asyncHandler;