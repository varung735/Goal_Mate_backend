const consoleFont = require('../utils/consoleFont');

module.exports = {
    error: (message) => {
        return `${consoleFont.error}${message}${consoleFont.resetFont}`;
    },
    success: (message) => {
        return `${consoleFont.success}${message}${consoleFont.resetFont}`;
    },
    warning: (message) => {
        return `${consoleFont.warning}${message}${consoleFont.resetFont}`;
    }
}