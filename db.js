const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

const conection = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE
});

conection.connect((err) => {
    if (err) {
        console.log('koneksi ke database gagal');
        console.log(err);
    }else{
        console.log('koneksi berhasil');
    }
});

module.exports = conection
