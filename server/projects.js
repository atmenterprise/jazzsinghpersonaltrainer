export const projectSlug = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export function validateProject(input) {
  const { id, name, domain } = input || {};
  if (typeof id !== 'string' || id.length > 80 || !projectSlug.test(id)) throw new Error('Use a project ID with lowercase letters, numbers and hyphens.');
  if (typeof name !== 'string' || !name.trim() || name.length > 150) throw new Error('Project name is required (up to 150 characters).');
  let url;
  try { url = new URL(domain); } catch { throw new Error('Enter a complete project URL, such as https://example.com.'); }
  if (!(url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(url.hostname))) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) throw new Error('Use an HTTPS project origin without paths or credentials. HTTP is allowed for localhost.');
  return { id, name: name.trim(), domain: url.origin };
}
export async function hasProjectAccess(sql, projectId, subject) {
  const rows = await sql`SELECT project_id FROM admin_project_members WHERE project_id = ${projectId} AND auth0_sub = ${subject}`;
  return rows.length > 0;
}
