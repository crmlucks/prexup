import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  console.log('🔧 Reparando auto-incremento de ID...');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'default'
    });

    // 1. Forzar que el ID sea auto-incremental
    // Nota: Esto también asegura que sea PRIMARY KEY si no lo era.
    await connection.query("ALTER TABLE leads MODIFY COLUMN id INT AUTO_INCREMENT PRIMARY KEY");

    // 2. Asegurar que las otras columnas existan (por si acaso)
    const migrations = [
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS email VARCHAR(255) AFTER phone",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'new' AFTER email",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) AFTER status",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_interest VARCHAR(255) AFTER source",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_agent VARCHAR(255) AFTER project_interest",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget VARCHAR(50) AFTER assigned_agent",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD' AFTER budget",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS details TEXT AFTER currency",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ];

    for (const query of migrations) {
      try {
        await connection.query(query);
      } catch (err) {
        console.warn('Migración saltada o ya aplicada:', err);
      }
    }

    await connection.end();
    return NextResponse.json({ 
      success: true, 
      message: '🚀 ¡ID arreglado y esquema actualizado! Ya puedes guardar leads.' 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
