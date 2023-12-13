const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const conection = require('./db');

const app = express(); 

app.get('/', (request, response) => {
    response.send('server berjalan'); 
});

const port = process.env.PORT || 5000;
const host = 'localhost'; 

app.listen(port, host, ()=>{
    console.log(`server berjalan di http://${host}:${port}`);
}); 
