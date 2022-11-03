const mysql = require('mysql2/promise');
const db = {};

db.getConnection = async () => {

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    })

    return connection;
}

module.exports = db;