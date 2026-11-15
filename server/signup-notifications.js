import { sendSignupMail } from './signup-mail.js';
import { database } from './db.js';
import { recordAccessRequest, notifyAccessRequest } from './access-requests.js';

export async function captureSignupNotifications(request, path, response, getDatabase = database, sendMail = sendSignupMail) {
  if (request.method !== 'POST' || path !== 'sign-up/email' || !response.ok) return;
  try {
    // Read only the trusted upstream response, never the submitted account ID.
    // Verification-required signups can return a user without a session token.
    const result = await response.clone().json();
    if (!result.user?.id) return;
    const sql = getDatabase();
    const row = await recordAccessRequest(sql, result.user);
    await notifyAccessRequest(sql, row, process.env, sendMail);
  } catch {
    // Account creation already succeeded. Never misreport it as a failure.
    console.error('Unable to record signup notifications; pending users can retry from the studio.');
  }
}
