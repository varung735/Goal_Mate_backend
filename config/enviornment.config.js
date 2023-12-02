const dotenv = require('dotenv');
dotenv.config();

const config = {
    port: process.env.PORT,
    enviornment: process.env.ENVIORNMENT,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiry: process.env.JWT_EXPIRY || '1d',
    allowed_source_prod: process.env.ALLOWED_SOURCE_PROD,
    allowed_source_local: process.env.ALLOWED_SOURCE_LOCAL,
    mongo_url: process.env.MONGO_URL
};

module.exports = config;