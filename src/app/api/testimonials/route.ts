import { database } from '../../../../server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sql = database();
    // A fixed server-side project prevents exposing other studio clients' content.
    const project = process.env.PUBLIC_PROJECT_ID || process.env.SEED_PROJECT_SLUG || 'jazboom';
    const rows = await sql`SELECT id, source_key, data FROM admin_content
      WHERE project_id = ${project} AND resource = 'testimonials'
      ORDER BY CASE WHEN source_key ~ '^[0-9]+$' THEN source_key::bigint END ASC NULLS LAST, created_at, id`;
    return Response.json(rows.map(row => ({
      id: row.source_key || row.id,
      featured: row.data.featured === true,
      testimonial: row.data,
    })), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Testimonials are temporarily unavailable.' }, { status: 503 });
  }
}
