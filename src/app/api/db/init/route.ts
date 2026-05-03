import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  console.log('🚀 Iniciando autoconfiguración de base de datos desde la App...');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'prexup_crm'
    });

    console.log('✅ Conexión establecida internamente.');

    // Crear tablas
    const queries = [
      `CREATE TABLE IF NOT EXISTS leads (
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
      )`,
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id VARCHAR(50) NOT NULL,
        message_text TEXT,
        message_type VARCHAR(50) DEFAULT 'text',
        media_url TEXT,
        is_from_me TINYINT(1) DEFAULT 0,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS properties (
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
    ];

    for (const query of queries) {
      await connection.query(query);
    }

    await connection.end();
    return NextResponse.json({ 
      success: true, 
      message: '✨ Tablas creadas correctamente en la base de datos de producción.' 
    });

  } catch (error: any) {
    console.error('❌ Error de inicialización:', error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
