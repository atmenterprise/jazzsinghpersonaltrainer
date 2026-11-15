import { authenticateAdmin } from './auth.js';
import { database } from './db.js';
import { resources, validate } from './content.js';
import { hasProjectAccess, projectSlug, validateProject } from './projects.js';
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function createHandler(getDatabase = database, authenticate = authenticateAdmin, projectAccess = hasProjectAccess) {
  return async function handler(req, res) {
    const send = (status, data) => { res.statusCode = status; res.end(JSON.stringify(data)); };
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
    let identity;
    try { identity = await authenticate(req); }
    catch (error) {
      const status = [401, 403, 503].includes(error.status) ? error.status : 503;
      if (status === 401) res.setHeader('WWW-Authenticate', 'Bearer');
      return send(status, { error: error.status ? error.message : 'Authentication service unavailable.' });
    }
    if (req.method === 'GET' && new URL(req.url, 'http://localhost').pathname === '/api/admin/session') {
      return send(200, { sub: identity.sub });
    }
    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    const [, admin, resource, id, extra] = parts;
    if (parts[0] !== 'api' || admin !== 'admin' || (!resources[resource] && resource !== 'projects') || extra || (id && (resource === 'projects' || !uuid.test(id)))) return send(404, { error: 'Endpoint not found.' });
    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(req.method) || (req.method === 'POST' && id) || (['PUT', 'DELETE'].includes(req.method) && !id)) return send(405, { error: 'Method not allowed.' });
    let body;
    if (req.method !== 'GET') {
      if (!req.headers['content-type']?.startsWith('application/json')) return send(415, { error: 'Use application/json.' });
      try {
        if (req.body !== undefined) {
          const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
          if (Buffer.byteLength(raw) > 100000) return send(413, { error: 'Record too large.' });
          body = JSON.parse(raw);
        } else {
          let raw = ''; let size = 0;
          for await (const chunk of req) { size += Buffer.byteLength(chunk); if (size > 100000) return send(413, { error: 'Record too large.' }); raw += chunk; }
          body = JSON.parse(raw);
        }
      } catch { return send(400, { error: 'Invalid JSON body.' }); }
      if (['PUT', 'DELETE'].includes(req.method) && (!Number.isInteger(body?.version) || body.version < 1)) return send(400, { error: 'Record version is required.' });
    }
    let data;
    if (['POST', 'PUT'].includes(req.method)) {
      try { data = resource === 'projects' ? validateProject(body?.data) : validate(resource, body?.data); } catch (error) { return send(400, { error: error.message }); }
    }
    try {
      const sql = getDatabase();
      if (resource === 'projects') {
        if (req.method === 'GET') {
          return send(200, await sql`SELECT p.* FROM admin_projects p JOIN admin_project_members m ON m.project_id = p.id WHERE m.auth0_sub = ${identity.sub} ORDER BY p.name, p.id`);
        }
        if (req.method !== 'POST') return send(405, { error: 'Method not allowed.' });
        const [rows] = await sql.transaction([
          sql`INSERT INTO admin_projects(id, name, domain) VALUES (${data.id}, ${data.name}, ${data.domain}) RETURNING *`,
          sql`INSERT INTO admin_project_members(project_id, auth0_sub) VALUES (${data.id}, ${identity.sub})`,
        ]);
        return send(201, rows[0]);
      }
      const projectId = url.searchParams.get('project');
      if (!projectId || projectId.length > 80 || !projectSlug.test(projectId)) return send(400, { error: 'Select a valid project.' });
      if (!await projectAccess(sql, projectId, identity.sub)) return send(403, { error: 'You do not have access to this project.' });
      if (req.method === 'GET') {
        const rows = id ? await sql`SELECT * FROM admin_content WHERE project_id = ${projectId} AND resource = ${resource} AND id = ${id}` : await sql`SELECT * FROM admin_content WHERE project_id = ${projectId} AND resource = ${resource} ORDER BY created_at, id`;
        if (id && !rows.length) return send(404, { error: 'Record not found.' });
        return send(200, id ? rows[0] : rows);
      }
      if (req.method === 'POST') {
        const [row] = await sql`INSERT INTO admin_content(project_id, resource, data) VALUES (${projectId}, ${resource}, ${JSON.stringify(data)}::jsonb) RETURNING *`;
        return send(201, row);
      }
      const rows = req.method === 'PUT'
        ? await sql`UPDATE admin_content SET data = ${JSON.stringify(data)}::jsonb, version = version + 1, updated_at = now() WHERE project_id = ${projectId} AND resource = ${resource} AND id = ${id} AND version = ${body.version} RETURNING *`
        : await sql`DELETE FROM admin_content WHERE project_id = ${projectId} AND resource = ${resource} AND id = ${id} AND version = ${body.version} RETURNING id`;
      if (!rows.length) return send(409, { error: 'Record changed or was removed. Reload before trying again.' });
      return send(200, req.method === 'DELETE' ? { deleted: true } : rows[0]);
    } catch (error) {
      if (error.code === '23505') return send(409, { error: 'That project ID or domain is already registered.' });
      return send(503, { error: 'Database unavailable. Check the server DATABASE_URL and run the database setup.' });
    }
  };
}
export default createHandler();
