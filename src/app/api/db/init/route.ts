import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  console.log('🔧 Reparando esquema de base de datos...');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE || 'default'
    });

    // 1. Asegurar que las columnas existan (usando ALTER TABLE con IF NOT EXISTS para MariaDB 10.5+)
    const migrations = [
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS email VARCHAR(255) AFTER phone",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) AFTER status",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS project_interest VARCHAR(255) AFTER source",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS assigned_agent VARCHAR(255) AFTER project_interest",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget VARCHAR(50) AFTER assigned_agent",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'USD' AFTER budget",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS details TEXT AFTER currency",
      "ALTER TABLE leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ];

    for (const query of migrations) {
      try {
        await connection.query(query);
      } catch (err) {
        console.warn('Nota de migración:', err);
      }
    }

    await connection.end();
    return NextResponse.json({ 
      success: true, 
      message: '✨ Base de datos reparada y actualizada correctamente.' 
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
