// Use the MariaDB Node.js Connector
import mariadb from  'mariadb';  
// Create a connection pool
const pool =
    mariadb.createPool({
        host: process.env.DATABASE_host,
        port: process.env.DATABASE_port,
        user: process.env.DATABASE_user,
        password: process.env.DATABASE_password,
        database: process.env.DATABASE
    });

export const db = Object.freeze({
    pool: pool
});

// Expose a method to establish connection with MariaDB SkySQL
