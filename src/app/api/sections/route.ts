import { database } from '../../../../server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = database();
    const project = process.env.PUBLIC_PROJECT_ID || process.env.SEED_PROJECT_SLUG || 'jazboom';
    const rows = await sql`SELECT id, resource, source_key, data FROM admin_content
      WHERE project_id = ${project} AND resource IN ('about', 'specialistareas')
      ORDER BY CASE WHEN source_key ~ '^[0-9]+$' THEN source_key::bigint END ASC NULLS LAST, created_at, id`;
    return Response.json({
      about: rows.find(row => row.resource === 'about')?.data || null,
      specialistAreas: rows.filter(row => row.resource === 'specialistareas').map(row => ({ ...row.data, id: row.id })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Website sections are temporarily unavailable.' }, { status: 503 });
  }
}
