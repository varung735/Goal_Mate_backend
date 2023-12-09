const transportConfig = require('../config/mailTransporter.config');
const config = require('../config/enviornment.config');

const sendMail = async (options) => {
    const message = {
        from: config.smtp_user,
        to: options.email,
        subject: options.subject,
        text: options.text
    }

    await transportConfig.sendMail(message);
}

module.exports = sendMail;