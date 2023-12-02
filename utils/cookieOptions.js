const config = require('../config/enviornment.config');

const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24* 60 * 60 * 1000),
    httpOnly: config.enviornment === 'PRODUCTION',
    secure: config.enviornment === 'PRODUCTION',
    sameSite: 'lax'
};

module.exports = cookieOptions;