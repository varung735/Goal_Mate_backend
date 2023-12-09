const dotenv = require('dotenv');
dotenv.config();

const config = {
    port: process.env.PORT,
    enviornment: process.env.ENVIORNMENT,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiry: process.env.JWT_EXPIRY || '1d',
    allowed_source_prod: process.env.ALLOWED_SOURCE_PROD,
    allowed_source_local: process.env.ALLOWED_SOURCE_LOCAL,
    mongo_url: process.env.MONGO_URL,
    smtp_host: process.env.SMTP_HOST,
    smtp_email: process.env.SMTP_EMAIL,
    smtp_port: process.env.SMTP_PORT,
    smtp_is_secure: process.env.SMTP_IS_SECURE,
    smtp_user: process.env.SMTP_USERNAME,
    smtp_pass: process.env.SMTP_PASSWORD
};

module.exports = config;