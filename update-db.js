const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateDatabase() {
  console.log('🚀 Actualizando el esquema de la base de datos PrexUp...');

  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'prexup_crm',
  };

  try {
    const db = await mysql.createConnection(config);
    console.log(`✅ Conectado a la base de datos "${config.database}".`);

    // 1. Add is_read to chat_messages if it doesn't exist
    try {
      await db.query(`ALTER TABLE chat_messages ADD COLUMN is_read TINYINT(1) DEFAULT 0`);
      console.log('   ✔ Columna "is_read" añadida a "chat_messages".');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('   ℹ Columna "is_read" ya existe en "chat_messages".');
      } else {
        throw e;
      }
    }

    // 2. Create quick_responses table
    try {
      await db.query(`CREATE TABLE IF NOT EXISTS quick_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'general',
        sort_order INT DEFAULT 0
      )`);
      console.log('   ✔ Tabla "quick_responses" lista.');
    } catch (e) {
      throw e;
    }

    await db.end();
    console.log('\n✨ ¡Actualización de la base de datos completada con éxito!');
  } catch (error) {
    console.error('\n❌ Error durante la actualización:');
    console.error(error.message);
    process.exit(1);
  }
}

updateDatabase();
