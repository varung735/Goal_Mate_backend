const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/enviornment.config');

(async () => {
    try {
        await mongoose.connect(config.mongo_url);
        console.log('Connected to DB');

        app.on('error', error => {
            console.log('ERROR', error);
            throw error;
        });

        app.listen(config.port, () => {
            console.log(`Server is listening on ${config.port}`);
        });
    } catch (error) {
        console.log(`Cannot Connect to DB \n${error}`);
        throw error;
    }
})();