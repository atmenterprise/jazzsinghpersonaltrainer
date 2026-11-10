import { readFile } from 'node:fs/promises';
import { database } from '../server/db.js';

const originals = JSON.parse(await readFile(new URL('../src/data/testimonials.json', import.meta.url), 'utf8'));
const sql = database();
const project = process.env.PUBLIC_PROJECT_ID || process.env.SEED_PROJECT_SLUG || 'jazboom';
const rows = await sql`SELECT source_key, data FROM admin_content WHERE project_id = ${project} AND resource = 'testimonials'`;
let missing = 0;
let changed = 0;
for (const original of originals) {
  const row = rows.find(record => record.source_key === String(original.id));
  if (!row) { missing++; continue; }
  if (row.data.featured !== original.featured || Object.entries(original.testimonial).some(([key, value]) => row.data[key] !== value)) changed++;
}
console.log(JSON.stringify({ project, originalTestimonials: originals.length, databaseTestimonials: rows.length, missing, differingFromOriginal: changed }));
if (missing || changed) process.exitCode = 1;
