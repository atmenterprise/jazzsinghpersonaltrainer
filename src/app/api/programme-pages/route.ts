import { database } from '../../../../server/db';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET() {
  try {
    const sql = database();
    const project = process.env.PUBLIC_PROJECT_ID || process.env.SEED_PROJECT_SLUG || 'jazboom';
    const rows = await sql`SELECT data FROM admin_content WHERE project_id = ${project} AND resource = 'programme_pages' ORDER BY source_key, id`;
    return Response.json(rows.map(row => row.data), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return Response.json({ error: 'Programme pages are temporarily unavailable.' }, { status: 503 });
  }
}
