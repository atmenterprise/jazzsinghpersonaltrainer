import { createServer } from 'node:http';
import app from './app.js';
const port = Number(process.env.API_PORT || 3001);
createServer(app).listen(port, '127.0.0.1', () => console.log(`Admin API listening at http://127.0.0.1:${port}`));
