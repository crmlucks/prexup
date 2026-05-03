const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupDatabase() {
  console.log('🚀 Iniciando configuración de la base de datos PrexUp...');
  console.log('--- Intentando conectar con: ---');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`User: ${process.env.DB_USER}`);
  console.log(`Port: ${process.env.DB_PORT || 3306}`);
  console.log('---------------------------------');

  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };

  try {
    // 1. Conexión inicial
    const connection = await mysql.createConnection(config);
    const dbName = process.env.DB_NAME || 'prexup_crm';
    
    console.log('✅ Conexión al servidor establecida.');
    
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✅ Base de datos "${dbName}" verificada/creada.`);
    await connection.end();

    // 2. Conexión a la DB específica para crear tablas
    const db = await mysql.createConnection({ ...config, database: dbName });
    console.log('📦 Creando tablas...');

    const tables = [
      {
        name: 'leads',
        query: `CREATE TABLE IF NOT EXISTS leads (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          phone VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(255),
          status VARCHAR(50) DEFAULT 'new',
          source VARCHAR(50),
          project_interest VARCHAR(255),
          assigned_agent VARCHAR(255),
          budget VARCHAR(50),
          currency VARCHAR(10) DEFAULT 'USD',
          details TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'chat_messages',
        query: `CREATE TABLE IF NOT EXISTS chat_messages (
          id INT AUTO_INCREMENT PRIMARY KEY,
          sender_id VARCHAR(50) NOT NULL,
          message_text TEXT,
          message_type VARCHAR(50) DEFAULT 'text',
          media_url TEXT,
          is_from_me TINYINT(1) DEFAULT 0,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      },
      {
        name: 'properties',
        query: `CREATE TABLE IF NOT EXISTS properties (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          price VARCHAR(50),
          location VARCHAR(255),
          type VARCHAR(100),
          beds INT,
          baths INT,
          area VARCHAR(50),
          status VARCHAR(50) DEFAULT 'Disponible',
          image_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
      }
    ];

    for (const table of tables) {
      await db.query(table.query);
      console.log(`   ✔ Tabla "${table.name}" lista.`);
    }

    await db.end();
    console.log('\n✨ ¡Configuración completada con éxito! Tu MariaDB está lista.');

  } catch (error) {
    console.error('\n❌ Error durante la configuración:');
    console.error('Mensaje:', error.message);
    console.error('Código:', error.code);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

setupDatabase();
