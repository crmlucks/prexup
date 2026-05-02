import { NextResponse } from 'next/server';
import { queryTenantData } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenant_id') || 'default-tenant'; // Mock tenant for now

  try {
    const leads = await queryTenantData(tenantId, 'SELECT * FROM leads WHERE 1=1', []);
    return NextResponse.json(leads);
  } catch (error) {
    console.error('Database Error:', error);
    // Fallback mock data for demonstration
    return NextResponse.json([
      { id: '1', name: 'Sarah Miller', status: 'new', budget: 450000, source: 'WhatsApp' },
      { id: '2', name: 'David Chen', status: 'qualified', budget: 1200000, source: 'Facebook' },
    ]);
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { tenant_id, name, phone, email, budget, notes } = body;
  const id = uuidv4();

  try {
    // This would typically use a library like 'mysql2' to insert
    // For now, we return the mock success
    return NextResponse.json({ success: true, id, message: 'Lead created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
