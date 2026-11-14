import { readFile } from 'node:fs/promises';
import { database } from '../server/db.js';
import { validate } from '../server/content.js';
import { validateProject } from '../server/projects.js';
const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
const schema = await readFile(new URL('../db/schema.sql', import.meta.url), 'utf8');
const programmes = await read('../src/data/programs.json');
const testimonials = await read('../src/data/testimonials.json');
const settings = await read('../src/data/siteConfig.json');
const highlights = await read('../src/data/storyHighlights.json');
const project = validateProject({ id: process.env.SEED_PROJECT_SLUG || 'jazboom', name: process.env.SEED_PROJECT_NAME || settings.title, domain: process.env.SEED_PROJECT_DOMAIN || settings.url });
const about = await read('../src/data/about.json');
const specialistAreas = await read('../src/data/specialistAreas.json');
const programmePages = await read('../src/data/programmePages.json');
const records = [
  ...programmePages.map(data => ['programme_pages', data.page_url, data]),
  ['about', 'about', about],
  ...specialistAreas.map(({ id, ...data }) => ['specialistareas', String(id), data]),
  ...programmes.map(({ id, ...data }) => ['programmes', String(id), data]),
  ...testimonials.map(({ id, featured, testimonial }) => ['testimonials', String(id), { ...testimonial, featured, ...Object.fromEntries(Object.entries(highlights[id] || {}).filter(([k]) => ['focus', 'headline', 'summary', 'excerpt'].includes(k))) }]),
  ...Object.entries(settings).filter(([, value]) => typeof value === 'string').map(([key, value]) => ['settings', key, { label: key, value }]),
  ...[
    ['home-background', 'Home hero background', 'Home header', 'img/header-jaz-training.jpg'],
    ['page-background', 'Inner page background', 'Programme, FAQ, booking and testimonial headers', 'img/header-jaz-training.jpg'],
    ['profile', 'Trainer profile photo', 'Home about section', 'img/profile/profile.jpg'],
    ['logo', 'Brand logo', 'Header, footer and watermarks', settings.logo],
    ['shop', 'Shop image', 'Home shop section', 'img/shop/reflex.jpg'],
    ...['treadmill', 'deadlift', 'balance', 'muscle', 'exercise-routine'].map(name => [name, `${name} specialist icon`, 'Home specialist areas', `img/icons/${name}.gif`]),
  ].map(([key, label, location, url]) => ['images', key, { label, location, url, alt: label }]),
];
for (const [resource, , data] of records) validate(resource, data);
if (process.argv.includes('--check')) {
  console.log(`Validated ${records.length} seed records without connecting to a database.`);
  process.exit(0);
}
const sql = database();
await sql.transaction([
  ...schema.split(';').map(s => s.trim()).filter(Boolean).map(s => sql.query(s)),
  sql`INSERT INTO admin_projects(id, name, domain) VALUES (${project.id}, ${project.name}, ${project.domain}) ON CONFLICT (id) DO NOTHING`,
  sql`UPDATE admin_content SET project_id = ${project.id} WHERE project_id IS NULL`,
  sql`ALTER TABLE admin_content ALTER COLUMN project_id SET NOT NULL`,
  ...(process.env.ADMIN_PROJECT_OWNER_SUB ? [sql`INSERT INTO admin_project_members(project_id, auth0_sub) VALUES (${project.id}, ${process.env.ADMIN_PROJECT_OWNER_SUB}) ON CONFLICT DO NOTHING`] : []),
  ...records.map(([resource, key, data]) => sql`INSERT INTO admin_content(project_id, resource, source_key, data) VALUES (${project.id}, ${resource}, ${key}, ${JSON.stringify(resource === 'testimonials' ? { ...validate(resource, data), ...data } : validate(resource, data))}::jsonb) ON CONFLICT (project_id, resource, source_key) DO UPDATE
    SET data = EXCLUDED.data, version = admin_content.version + 1, updated_at = now()
    WHERE admin_content.resource = 'testimonials'
      AND admin_content.data = ${JSON.stringify(validate(resource, data))}::jsonb
      AND admin_content.data IS DISTINCT FROM EXCLUDED.data`),
]);
console.log(`Database ready. Imported ${records.length} initial records into ${project.id}; existing records were preserved.`);
if (!process.env.ADMIN_PROJECT_OWNER_SUB) console.log('Set ADMIN_PROJECT_OWNER_SUB to the initial owner authentication subject and rerun setup to grant access to the imported project.');
