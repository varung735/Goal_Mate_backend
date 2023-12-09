const nodemailer = require('nodemailer');
const config = require('../config/enviornment.config');

const transport = nodemailer.createTransport({
    host: config.smtp_host,
    port: config.smtp_port,
    secure: config.smtp_is_secure,
    auth: {
        user: config.smtp_user,
        pass: config.smtp_pass
    }
});

module.exports = transport;