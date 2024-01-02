const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/enviornment.config');
const errorMessages = require('./utils/errorMessages');

(async () => {
    try {
        await mongoose.connect(config.mongo_url);
        console.log(errorMessages.success('Connected To DB'));

        app.on('error', error => {
            console.log(errorMessages.error(`ERROR: ${error}`));
            throw error;
        });

        app.listen(config.port, () => {
            console.log(errorMessages.warning(`Server is listening on ${config.port}`));
        });
    } catch (error) {
        console.log(errorMessages.error(`Cannot Connect to DB \n${error}`));
        throw error;
    }
})();
