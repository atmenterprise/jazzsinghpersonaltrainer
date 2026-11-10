import { readFile } from 'node:fs/promises';
import { database } from '../server/db.js';

const originals = JSON.parse(await readFile(new URL('../src/data/programmePages.json', import.meta.url)));
const sql = database();
const project = process.env.PUBLIC_PROJECT_ID || process.env.SEED_PROJECT_SLUG || 'jazboom';
const rows = await sql`SELECT source_key, data FROM admin_content WHERE project_id = ${project} AND resource = 'programme_pages'`;
let missing = 0;
let changed = 0;
for (const original of originals) {
  const row = rows.find(record => record.source_key === original.page_url);
  if (!row) { missing++; continue; }
  if (Object.entries(original).some(([key, value]) => row.data[key] !== value)) changed++;
}
console.log(JSON.stringify({ project, originalPages: originals.length, databasePages: rows.length, missing, differingFromOriginal: changed }));
if (missing || changed) process.exitCode = 1;
