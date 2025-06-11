// server/config/dbPool.js
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: process.env.DB_PORT,  // ensure this is DB_PORT, not server PORT
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
pool.query('SELECT 1')
  .then(() => console.log('✅ Database connection successful'))
  .catch(err => console.error('❌ DB connection failed:', err));

module.exports = pool;
