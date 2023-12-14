'use strict';
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./router/endpoint');
const cors = require('cors');

const app = express();

dotenv.config();

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(routes);
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('server berjalan'); 
});

const port = process.env.PORT || 5000;
const host = 'localhost';

app.listen(port, host, () => {
    console.log(`server berjalan di http://${host}:${port}`);
});
