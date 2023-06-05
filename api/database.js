// Use the MariaDB Node.js Connector
const mariadb = require( 'mariadb');
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

export  async function query(text) {

        return await pool.query(text)
}

export async function db_test() {
    let conn;
    try {
        conn = await pool.getConnection();
        print(conn);
        return await conn.query("Select * from Account");
    }
    finally {
        if (conn) conn.release(); //release to pool
    }
}

// Expose a method to establish connection with MariaDB SkySQL