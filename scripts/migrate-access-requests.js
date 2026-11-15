import { readFile } from 'node:fs/promises';
import { database } from '../server/db.js';
const schema = await readFile(new URL('../db/access-requests.sql', import.meta.url), 'utf8');
const sql = database();
await sql.transaction(schema.split(';').map(statement => statement.trim()).filter(Boolean).map(statement => sql.query(statement)));
console.log('Access request tables are ready. Existing content and memberships were preserved.');
