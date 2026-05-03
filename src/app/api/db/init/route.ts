import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  console.log('☢️ Iniciando REINICIO TOTAL de la tabla leads...');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'default'
    });

    // 1. ELIMINAR LA TABLA MAL CONFIGURADA
    await connection.query("DROP TABLE IF EXISTS leads");
    console.log('✅ Tabla vieja eliminada.');

    // 2. CREAR LA TABLA DESDE CERO CON EL ESQUEMA PERFECTO
    const createQuery = `
      CREATE TABLE leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255),
        status VARCHAR(50) DEFAULT 'new',
        source VARCHAR(50) DEFAULT 'WhatsApp',
        project_interest VARCHAR(255),
        assigned_agent VARCHAR(255),
        budget VARCHAR(50) DEFAULT '0',
        currency VARCHAR(10) DEFAULT 'USD',
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;

    await connection.query(createQuery);
    console.log('✅ Tabla nueva creada con Auto-Incremento.');

    await connection.end();
    return NextResponse.json({ 
      success: true, 
      message: '🚀 ¡REINICIO EXITOSO! La tabla leads ha sido reconstruida. Ya puedes guardar leads sin errores.' 
    });

  } catch (error: any) {
    console.error('❌ Error en el reinicio:', error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
