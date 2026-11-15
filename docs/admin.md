# ATM Content Studio with Neon Auth

The public website remains a Vite React SPA. The admin and API run on Next.js App Router using `@neon/auth` and Neon managed Better Auth. Auth0 and the temporary unauthenticated access mode have been removed. `ADMIN_AUTH_DISABLED` no longer has any effect.

## Local setup

1. Install dependencies with `npm install`.
2. Configure `.env.local` with `NEON_AUTH_BASE_URL` (the Auth URL from Neon), `NEON_AUTH_COOKIE_SECRET` (at least 32 random characters), and `DATABASE_URL`. Generate the secret with `openssl rand -hex 32`. The supplied Neon Auth URL is in `.env.example`.
3. Run `npm run dev` and open `/admin`. Sign up through `/auth/sign-up`. Neon manages credentials, verification emails, password resets and sessions.
4. New users see a pending-access screen containing their Neon user ID. Set `ADMIN_PROJECT_OWNER_SUB` to the owner's Neon user ID. Run `npm run db:setup` to seed the project and grant membership. This command reads `.env` explicitly; put its database and owner configuration in `.env` or export them in your shell. Next.js gives `.env.local` precedence at runtime, so keep the files consistent.
5. Restart the app after changing environment variables. The approved owner can edit the seeded project or create new projects.

The React/Vite quickstart's `VITE_NEON_AUTH_URL` is accepted as a fallback on the server, but `NEON_AUTH_BASE_URL` is preferred here. Browser authentication uses `/api/auth`, not cross-site requests to the Neon hostname. No cookie secret or database credential is bundled into the frontend. Start the full app with `npm run dev`; `npm run dev:site` serves only the public website.

## Vercel setup

Set these server-side environment variables in the Vercel project for the intended environments, then redeploy:

| Variable | Value |
| --- | --- |
| `NEON_AUTH_BASE_URL` | Your branch's Neon Auth URL, including `/neondb/auth` |
| `NEON_AUTH_COOKIE_SECRET` | A generated secret of at least 32 characters |
| `DATABASE_URL` | Content database connection string |
| `ADMIN_PROJECT_OWNER_SUB` | Initial owner's Neon Auth user ID |
| `ADMIN_USER_IDS` | Optional comma-separated approved user IDs |
| `APP_BASE_URL` | Optional HTTPS origin for a custom admin domain |

In Neon Console → branch → Auth → Configuration, add the admin's production domain and development domain to trusted domains. Configure preview domains according to your preview deployment policy. Use matching Auth URLs and database branches for preview and production. Configure the branch's email/password and email verification settings as required. The UI supports resending verification email, forgotten passwords and reset links. This integration does not enable social providers.

The local cookie secret is in the ignored `.env.local`; it has not been copied to Vercel. This implementation does not modify hosted environment variables or Neon trusted-domain settings. Remove obsolete Auth0 variables from hosted settings separately.

## Approval and project access

Every admin API call verifies the session with Neon's server SDK, bypassing the SDK cookie cache to check session revocation. The verified Neon user ID is the application's identity subject. A user may access the studio when any of these server-trusted conditions is met:

- The user has membership in at least one content project.
- Their ID matches `ADMIN_PROJECT_OWNER_SUB` or appears in `ADMIN_USER_IDS`.
- Neon assigns them the managed Better Auth `admin` role.

Signup, a matching email address, editable user metadata and client-supplied headers do not grant approval. The owner/allowlist/admin role allows entering the studio and creating projects, but does not bypass project memberships. Creating a project atomically grants its creator membership. Reads, updates and deletes require membership in the selected project and scope database queries by project ID. Same-origin checks reject cross-site content writes.

The database retains the legacy `admin_project_members.auth0_sub` column name to preserve existing data. It now holds Neon user IDs. To grant an existing project:

```sql
INSERT INTO admin_project_members (project_id, auth0_sub)
VALUES ('jazboom', 'NEON_USER_ID')
ON CONFLICT DO NOTHING;
```

Existing Auth0 IDs do not map automatically to Neon identities. Grant membership to the new Neon ID; retain or revoke old rows according to your migration plan. No passwords are stored in these content tables. The setup script preserves existing content and grants the configured owner access to the seeded project.

## Routes and account settings

- `/admin`: protected studio and pending-access screen.
- `/auth/sign-in`, `/auth/sign-up`: email/password authentication.
- `/auth/forgot-password`, `/auth/reset-password`: password recovery.
- `/auth/verify-email`: resend verification email.
- `/admin/account`: profile name, password change, signing out other devices and current-session sign-out. Available to signed-in users awaiting project access too.
- `/api/auth/*`: Neon SDK proxy for authentication/session operations.
- `/api/admin/auth/status`: sanitized session and approval status; never returns tokens.
- `/api/admin/*`: content API with independent authentication and project authorization.

Auth pages use the studio's existing styles and the SDK directly. Neon's older `NeonAuthUIProvider` package is superseded in the current docs, so it is not added to this app. Public page requests and assets remain outside auth middleware. Auth routes use fixed local redirects to avoid accepting arbitrary redirect targets.

## Validation

Run `npm run test:admin`, `npm run typecheck`, and `npm run build`. Start production with `npm start`, then run `npm run test:smoke`. Tests cover session expiry and identity matching, signup without approval, owner/role/member approval, project isolation, cross-site writes, retired bypass flags, token privacy, upstream errors and content validation. Live email delivery and authenticated browser flows require a user account and configured Neon trusted domains.

References: [Neon Next.js quickstart](https://neon.com/docs/auth/quick-start/nextjs-api-only), [server SDK](https://neon.com/docs/auth/reference/nextjs-server), [trusted domains](https://neon.com/docs/auth/guides/configure-domains).

## Signup notifications and administrator approvals

Successful email signups through `/api/auth/sign-up/email` create an access request from Neon's server response, including accounts that still require email verification. Gmail SMTP sends separate messages to `atmenterprise23@gmail.com` and the applicant. These messages are access notifications; Neon continues to handle verification and password-reset emails. Direct signups outside this application's auth proxy are not captured until the user opens the pending-access screen.

For an existing database, apply only the new tables using `db/access-requests.sql` in the Neon SQL Editor, or run `npm run db:migrate:access` with the production content `DATABASE_URL` in `.env` or exported in your shell. This migration preserves existing content and memberships. Fresh `npm run db:setup` runs also include these tables. The migration command reads `.env`, not `.env.local`.

In Vercel, add these **server-only** environment variables for the intended environments and redeploy:

- `GMAIL_SMTP_USER=atmenterprise23@gmail.com` (or the Gmail account sending the notifications).
- `GMAIL_SMTP_APP_PASSWORD`: that account's Google App Password, not its ordinary account password. Enable 2-Step Verification and create one at https://myaccount.google.com/apppasswords. Never commit the password or expose it through a public environment variable prefix.
- `ADMIN_PROJECT_OWNER_SUB`: the main administrator's Neon user ID. Additional global administrators can be designated using `ADMIN_USER_IDS`, or Neon's managed `admin` role. These trusted administrators can approve requests for any existing project; ordinary project members cannot list requests or approve users.

Administrators open **Access requests** in the workspace sidebar (also available before they have project membership), select a project, and choose **Approve access**. Approval atomically inserts `(project_id, auth0_sub)` with `ON CONFLICT DO NOTHING` and records the approver and time. It does not grant an administrator role. The applicant clicks **Check access again** to enter their assigned project. Previously registered pending users submit their request automatically on opening the pending-access screen.

The panel displays email delivery counts and offers **Retry signup emails**. Each recipient has an independent delivery record; concurrent attempts are claimed for five minutes, and recorded successful emails are skipped. Failures remain retryable after five minutes. There is no scheduled retry worker: use the panel or reopen the pending-access screen. A crash after SMTP accepts an email but before the database records it may cause a duplicate on retry. SMTP failures never undo a successful signup or an approved membership. Database failures during signup are logged without secrets; the pending-access screen retries request registration after sign-in.

Deployment check: sign up with a new test account, confirm both inboxes receive their notification, confirm an ordinary editor cannot access `/api/admin/access-requests`, approve as an administrator, and check the applicant can open only the assigned project. Live delivery requires valid Gmail credentials and the migration; automated tests use a fake transport and send no real emails.
