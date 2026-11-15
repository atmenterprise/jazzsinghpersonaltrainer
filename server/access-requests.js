import { AuthError } from './auth.js';
import { projectSlug } from './projects.js';
import { sendSignupMail } from './signup-mail.js';

// Call only with a user returned by Neon, never browser-submitted account data.
export async function recordAccessRequest(sql, user) {
  if (!user || typeof user.id !== 'string' || !user.id || typeof user.email !== 'string' || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(user.email)) throw new Error('Invalid Neon signup identity.');
  const [row] = await sql`INSERT INTO admin_access_requests(user_id, email, name)
    VALUES (${user.id}, ${user.email}, ${user.name || ''})
    ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name RETURNING *`;
  return row;
}

export async function notifyAccessRequest(sql, row, env = process.env, sendMail = sendSignupMail) {
  // Claims prevent concurrent page loads/retries from repeatedly sending email.
  // A crashed invocation becomes retryable after five minutes.
  const results = await Promise.all(['owner', 'applicant'].map(async kind => {
    const claimed = await sql`INSERT INTO admin_access_notifications(user_id, recipient_kind, claimed_until, attempts)
      VALUES (${row.user_id}, ${kind}, now() + interval '5 minutes', 1)
      ON CONFLICT (user_id, recipient_kind) DO UPDATE
      SET claimed_until = now() + interval '5 minutes', attempts = admin_access_notifications.attempts + 1
      WHERE admin_access_notifications.sent_at IS NULL
        AND admin_access_notifications.claimed_until < now() RETURNING user_id`;
    if (!claimed.length) return;
    try {
      await sendMail(row, kind, env);
      await sql`UPDATE admin_access_notifications SET sent_at = now(), claimed_until = NULL WHERE user_id = ${row.user_id} AND recipient_kind = ${kind}`;
    } catch {
      // Back off failures, keeping credentials and SMTP responses out of logs/UI.
      console.error('Signup notification delivery failed; retry from Access requests.');
      return kind;
    }
  }));
  return results.filter(Boolean);
}

export async function listAccessRequests(sql) {
  return sql`SELECT r.*, (SELECT count(*)::int FROM admin_access_notifications n WHERE n.user_id = r.user_id AND n.sent_at IS NOT NULL) AS notifications_sent
    FROM admin_access_requests r ORDER BY r.approved_at NULLS FIRST, r.created_at DESC LIMIT 500`;
}

export async function approveAccessRequest(sql, userId, projectId, approver) {
  if (typeof userId !== 'string' || !userId || userId.length > 200 || typeof projectId !== 'string' || projectId.length > 80 || !projectSlug.test(projectId)) throw new AuthError(400, 'Select a valid request and project.');
  // A single statement grants membership and records the decision atomically.
  const rows = await sql`WITH eligible AS MATERIALIZED (
    SELECT user_id FROM admin_access_requests WHERE user_id = ${userId} AND approved_at IS NULL FOR UPDATE
  ), granted AS (
    INSERT INTO admin_project_members(project_id, auth0_sub)
    SELECT p.id, r.user_id FROM admin_projects p CROSS JOIN eligible r
    WHERE p.id = ${projectId} AND r.user_id = ${userId}
    ON CONFLICT DO NOTHING RETURNING project_id
  ) UPDATE admin_access_requests r SET approved_at = now(), approved_by = ${approver}, project_id = ${projectId}
    WHERE r.user_id IN (SELECT user_id FROM eligible)
      AND EXISTS (SELECT 1 FROM admin_projects WHERE id = ${projectId}) RETURNING r.*`;
  if (!rows.length) throw new AuthError(409, 'Request was already approved or the request/project no longer exists. Reload requests.');
  return rows[0];
}
