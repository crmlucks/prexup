const mysql = require('mysql2/promise');
require('dotenv').config();

async function testRealConnection() {
  console.log('🔍 Intentando conectar a la base de datos REAL en el VPS...');
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });

    const [rows] = await connection.execute('SELECT name FROM tenants WHERE id = "default-tenant"');
    
    if (rows.length > 0) {
      console.log('✅ ¡CONEXIÓN EXITOSA!');
      console.log(`📡 Conectado a: ${process.env.DB_HOST}:${process.env.DB_PORT}`);
      console.log(`🏠 Agencia encontrada en el servidor: "${rows[0].name}"`);
    } else {
      console.log('⚠️ Conectado, pero no se encontró el tenant de prueba.');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ ERROR DE CONEXIÓN:');
    console.error(`   ${error.message}`);
    console.log('\n💡 Tip: Verifica que tu túnel SSH esté abierto en el puerto 3307.');
  }
}

testRealConnection();
