import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = "force-dynamic";

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'prexup_crm',
};

export async function GET() {
  const log: string[] = [];
  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);
    log.push('✅ Conexión exitosa a la base de datos');

    // 1. Agregar columna is_read a chat_messages
    try {
      await connection.query(`ALTER TABLE chat_messages ADD COLUMN is_read TINYINT(1) DEFAULT 0`);
      log.push('✔ Columna "is_read" añadida a chat_messages');
    } catch (e: any) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        log.push('ℹ Columna "is_read" ya existe en chat_messages');
      } else {
        log.push(`⚠ Error en is_read: ${e.message}`);
      }
    }

    // 2. Crear tabla quick_responses
    try {
      await connection.query(`CREATE TABLE IF NOT EXISTS quick_responses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        category VARCHAR(50) DEFAULT 'general',
        media_url TEXT,
        sort_order INT DEFAULT 0
      )`);
      log.push('✔ Tabla "quick_responses" lista');
      
      // Intentar agregar media_url por si ya existía sin ella
      try {
        await connection.query(`ALTER TABLE quick_responses ADD COLUMN media_url TEXT`);
        log.push('✔ Columna "media_url" añadida a quick_responses');
      } catch (e: any) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          log.push('ℹ Columna "media_url" ya existe en quick_responses');
        }
      }
    } catch (e: any) {
      log.push(`⚠ Error en quick_responses: ${e.message}`);
    }

    // 3. Verificar que chat_messages existe
    try {
      const [cols]: any = await connection.query('DESCRIBE chat_messages');
      log.push(`✔ chat_messages tiene columnas: ${cols.map((c: any) => c.Field).join(', ')}`);
    } catch (e: any) {
      log.push(`❌ chat_messages NO existe: ${e.message}`);
    }

    // 4. Verificar leads
    try {
      const [leads]: any = await connection.query('SELECT COUNT(*) as total FROM leads');
      log.push(`✔ Leads en la DB: ${leads[0].total}`);
    } catch (e: any) {
      log.push(`❌ Error en leads: ${e.message}`);
    }

    // 5. Verificar mensajes
    try {
      const [msgs]: any = await connection.query('SELECT COUNT(*) as total FROM chat_messages');
      log.push(`✔ Mensajes en la DB: ${msgs[0].total}`);
    } catch (e: any) {
      log.push(`⚠ Sin mensajes aún o tabla no existe`);
    }

    await connection.end();
    log.push('\n✨ Migración completada');

    return NextResponse.json({ success: true, log });
  } catch (error: any) {
    if (connection) await connection.end();
    log.push(`❌ Error de conexión: ${error.message}`);
    return NextResponse.json({ success: false, log, error: error.message }, { status: 500 });
  }
}
