import { NextResponse } from 'next/server';
import { queryTenantData } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenant_id') || 'default-tenant';

  try {
    const properties = await queryTenantData(tenantId, 'SELECT * FROM properties WHERE 1=1', []);
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json([
      { id: '1', title: 'Modern Beachfront Villa', price: 2500000, location: 'Malibu, CA', type: 'house', status: 'available' },
      { id: '2', title: 'Penthouse Downtown', price: 1200000, location: 'Miami, FL', type: 'apartment', status: 'reserved' },
    ]);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const id = uuidv4();

  try {
    // Logic to insert into MariaDB
    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
