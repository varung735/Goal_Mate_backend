const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const config = require('./config/enviornment.config');
const indexV1Router = require('./routers/index_v1.routes');

const app = express();

const corsOptions = {
    origin: config.enviornment == 'PRODUCTION' ? config.allowed_source_prod : config.allowed_source_local,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('tiny'));

app.use('/api/v1', indexV1Router);

module.exports = app;