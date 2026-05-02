import mysql from 'mysql2/promise';

// Multi-tenant database connection helper
export async function getDbConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '@PrexUp2026_',
    database: process.env.DB_NAME || 'prexup_crm',
  });
  return connection;
}

// Example query with tenant isolation
export async function queryTenantData(tenantId: string, sql: string, params: any[]) {
  const db = await getDbConnection();
  try {
    const [rows] = await db.execute(
      `${sql} AND tenant_id = ?`,
      [...params, tenantId]
    );
    return rows;
  } finally {
    await db.end();
  }
}
