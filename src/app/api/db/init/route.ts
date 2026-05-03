import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  console.log('🔄 Iniciando Limpieza y Reconstrucción...');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'default'
    });

    // Desactivar chequeo de llaves foráneas para poder borrar tranquilamente
    await connection.query("SET FOREIGN_KEY_CHECKS = 0");
    
    // 1. Borrado total
    await connection.query("DROP TABLE IF EXISTS leads");
    
    // 2. Creación limpia (sin duplicar llaves)
    const createQuery = `
      CREATE TABLE leads (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'new',
        source VARCHAR(50) DEFAULT 'WhatsApp',
        project_interest VARCHAR(255),
        assigned_agent VARCHAR(255),
        budget VARCHAR(50) DEFAULT '0',
        currency VARCHAR(10) DEFAULT 'USD',
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY unique_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(createQuery);
    
    // Reactivar chequeo
    await connection.query("SET FOREIGN_KEY_CHECKS = 1");

    await connection.end();
    
    return NextResponse.json({ 
      success: true, 
      version: "2.0-FINAL",
      message: '✨ TABLA RECONSTRUIDA CON ÉXITO. Ya puedes probar el guardado.' 
    });

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
