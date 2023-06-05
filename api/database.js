// Use the MariaDB Node.js Connector
import mariadb from  'mariadb';
console.log(process.env);   
// Create a connection pool
const pool =
    mariadb.createPool({
        host: process.env.DATABASE_host,
        port: process.env.DATABASE_port,
        user: process.env.DATABASE_user,
        password: process.env.DATABASE_password,
        database: process.env.DATABASE
    });

exports.db = ;

// Expose a method to establish connection with MariaDB SkySQL
