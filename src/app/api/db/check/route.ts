import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'prexup_crm'
};

export async function GET() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // 1. Contar total de leads
    const [countRow]: any = await connection.execute('SELECT COUNT(*) as total FROM leads');
    
    // 2. Traer los últimos 5 para verificar nombres
    const [lastLeads]: any = await connection.execute('SELECT id, name, phone, created_at FROM leads ORDER BY created_at DESC LIMIT 5');
    
    await connection.end();

    return NextResponse.json({
      status: "✅ CONECTADO A MARIADB",
      total_leads: countRow[0].total,
      ultimos_leads_registrados: lastLeads,
      config_usada: {
        host: dbConfig.host,
        database: dbConfig.database,
        user: dbConfig.user
      }
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: "❌ ERROR DE CONEXIÓN", 
      error: error.message 
    }, { status: 500 });
  }
}
