const mysql = require('mysql2')
require('dotenv').config()
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    connectTimeout: 30000
})



connection.connect((error) => {
    if(error){
        console.log(error);
        return
    }
    console.log('Conectado a la base de datos!')
})

module.exports = connection;