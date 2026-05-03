import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'default'
    });

    console.log('--- INICIANDO MIGRACIÓN SEGURA ---');

    // 1. Tabla de Leads (Si no existe, se crea. Si existe, no se toca)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'new',
        source VARCHAR(100),
        project_interest VARCHAR(255),
        assigned_agent VARCHAR(255),
        budget DECIMAL(15,2),
        currency VARCHAR(10) DEFAULT 'PEN',
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Tabla de Mensajes (Asegurando columnas multimedia)
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id VARCHAR(50) NOT NULL,
        message_text TEXT,
        message_type ENUM('text', 'image', 'video', 'document', 'audio') DEFAULT 'text',
        media_url TEXT,
        is_from_me TINYINT(1) DEFAULT 0,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.end();

    return NextResponse.json({ 
      success: true, 
      message: "Base de datos actualizada en MODO SEGURO (Sin pérdida de datos)",
      version: "3.0-STABLE"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
