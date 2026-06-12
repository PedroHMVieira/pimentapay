const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

if (process.env.NODE_ENV !== 'test') {
    pool.getConnection()
        .then(() => console.log('✅ Conectado ao banco pimentapay na porta 3306!'))
        .catch((err) => console.error('❌ Erro ao conectar no banco:', err.message));
}

module.exports = pool;