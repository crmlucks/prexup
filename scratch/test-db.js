const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    console.log('✅ Connection to MariaDB successful!');
    
    await connection.query('CREATE DATABASE IF NOT EXISTS prexup_crm');
    console.log('✅ Database prexup_crm verified/created.');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
}

testConnection();
