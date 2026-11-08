# ATM Content Studio

The admin at `/admin` is branded for ATM Enterprise, the development studio. Its wordmark, yellow (`#FFDE59`), charcoal (`#1A1A1A`), off-white background and Plus Jakarta Sans typography follow [ATM Enterprise](https://atmenterprise.github.io/atm/). The logo is reproduced from the reference site's inline SVG; a standalone copy is at `public/admin/atm-logo.svg`. Fonts load from Google Fonts with system fallbacks.

ATM Content Studio supports multiple projects in one database and one admin deployment. Each project has its own ID, website domain, content and members. The public website remains independent: saved edits appear publicly only after its content integration is connected. No deployment was performed.

## Setup and existing database upgrade

Use Node.js 22+ and install dependencies with `npm install`.

1. Configure a Neon PostgreSQL database and obtain its SSL connection string.
2. Copy `.env.example` to `.env` and replace the database and Auth0 placeholders. For an existing installation, preserve your current Auth0 API audience; the new ATM example is only a default for new installations.
3. Set `ADMIN_PROJECT_OWNER_SUB` to the initial owner's Auth0 **User ID**, such as `auth0|abc123` (not their email). This grants membership in the imported project. They must also hold the Auth0 `manage:content` permission.
4. Run `npm run db:setup`. It creates the project and membership tables, adds a project foreign key to existing content, migrates unassigned content to the imported project, and replaces the old import uniqueness constraint with one scoped by project. Schema changes, backfill and import run in one transaction. Existing content, IDs, versions and edits are preserved. Run this against a Neon development branch first before upgrading a production database.
5. Start `npm run dev:api` and `npm run dev` in separate terminals. Open the Vite URL at `/admin`. Vite forwards `/api` to port 3001; update the proxy if changing `API_PORT`.

The initial import uses the existing repository's JSON and defaults to project ID `jazboom`, with its name/domain from `siteConfig.json`. Optional `SEED_PROJECT_SLUG`, `SEED_PROJECT_NAME`, and `SEED_PROJECT_DOMAIN` override this initial project. Keep these stable on reruns. Do not point this site's importer at a different client project; create empty projects through the studio instead.

Setup is rerunnable: already imported rows are preserved; deliberately deleted seed records are recreated. If no owner subject is configured, imported content stays inaccessible until a member is assigned. `node scripts/setup-db.js --check` validates all 57 seed records without connecting to a database.

## Auth0 (admin only)

The Auth0 provider and SDK load only under `/admin/*`; public routes do not require authentication. The old shared token is no longer accepted.

1. Create an Auth0 **Single Page Application** for ATM Content Studio. Enable **Universal Login** and a database connection with signup allowed for the application.
2. Set **Allowed Callback URLs** and **Allowed Logout URLs** to `http://localhost:5173/admin` and your production studio URL, such as `https://studio.example.com/admin`. Set **Allowed Web Origins** to the corresponding origins without paths. If deploying the studio on additional domains, explicitly allow each origin/callback/logout URL. Merely registering a project domain does not grant Auth0 callback access.
3. Create or reuse an Auth0 API with **RS256** signing. For a new API, an example identifier is `https://atm-content-studio-api`. Authorize the admin SPA in the API's application access policy. Add `manage:content`; enable **RBAC** and **Add Permissions in the Access Token** using the Auth0 token profile that includes `permissions`.
4. Create an **Admin** role with `manage:content` and assign it to approved users manually. New signups do not receive content access automatically.
5. Set server `AUTH0_DOMAIN` (hostname only) and `AUTH0_AUDIENCE` (API identifier). Set public frontend `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID` (SPA client ID) and `VITE_AUTH0_AUDIENCE`. Domain/audience must match the server configuration. No client secret is needed.
6. Restart development processes. Configure the frontend values before a production build; Vite embeds them at build time.

Signup opens Auth0 with `screen_hint=signup`; returning users can sign in. The SDK uses Authorization Code flow with PKCE and keeps access tokens in memory. API requests obtain a current token from the SDK. The server verifies signature, issuer, audience, expiry and `manage:content` on every request. An authenticated account without that permission receives 403 before database access.

After permission assignment, select **Check access again** for a fresh token or sign out and back in. Existing access tokens retain their permissions until expiry, so choose an appropriate token lifetime. Use **Sign in again** if silent renewal cannot complete. Logout returns to `/admin` on the current studio origin.

Auth0 stores passwords, verification and account recovery. PostgreSQL stores Auth0 subject identifiers only in project memberships; it does not store passwords or sessions.

Official references: [React SDK](https://auth0.com/docs/quickstart/spa/react), [token validation](https://auth0.com/docs/secure/tokens/access-tokens/validate-access-tokens), [RBAC](https://auth0.com/docs/get-started/apis/enable-role-based-access-control-for-apis).

## Projects and access

Approved admins can use **New project** to register a unique project ID, display name and website origin, such as `https://example.com`. Project creation atomically grants the creator membership. Projects start empty. The switcher lists only projects assigned to the current Auth0 subject. Switching prompts before discarding unsaved edits. Every content operation checks membership and includes `project_id` in its database query, including record updates and deletes.

The domain is the project's canonical website origin: HTTPS, no path, credentials, query or fragment. HTTP localhost origins are supported for development. Relative image URLs resolve against this origin; HTTPS image URLs remain unchanged. Multiple projects require distinct IDs and canonical origins. Domain registration is metadata, not domain ownership verification, hosting setup, public publishing or DNS management.

Grant an additional approved user membership using the Neon SQL editor (replace both values):

```sql
INSERT INTO admin_project_members (project_id, auth0_sub)
VALUES ('project-id', 'auth0|USER_ID')
ON CONFLICT DO NOTHING;
```

Revoke membership with:

```sql
DELETE FROM admin_project_members
WHERE project_id = 'project-id' AND auth0_sub = 'auth0|USER_ID';
```

Membership alone is insufficient without Auth0 `manage:content`. This phase provides one content-editor access level per project. Team invitation UI, custom per-project collection schemas and project deletion/domain editing UI are not implemented.

## Content editing

Each project offers programmes/services, testimonials, an image library and site settings. Edit imagery, descriptions, client stories and featured summaries; add/delete records; search records; and preview selected images. Text fields render as plain text. New programme records do not generate public routes.

Images are HTTPS URLs or existing relative asset paths. Upload binaries to your media host first and paste their URLs; the studio does not upload or host files. Profile photos, backgrounds and logos are ordinary image records. Previewing an external image contacts that image's host.

Initial content comes from the current site. Its hardcoded programme page copy, FAQ, policies and structured testimonial journey steps remain outside the editable model. A future public adapter must map this content model to each website. There is no public read endpoint in this phase.

## Database model

| Table | Purpose |
| --- | --- |
| `admin_projects` | Project ID, display name, unique canonical domain and timestamp |
| `admin_project_members` | Auth0 subject-to-project membership; composite primary key |
| `admin_content` | Project foreign key, resource type, validated JSONB payload, import source key, version and timestamps |

`admin_content.id` is a generated UUID. `source_key` keeps original imported IDs/settings keys; uniqueness is `(project_id, resource, source_key)`. `version` prevents overwriting a record edited by another admin. Each project shares the same resource field schemas, defined in `server/content.js`. Secrets stay in the server environment.

## API

All endpoints require an approved user's `Authorization: Bearer <AUTH0_API_ACCESS_TOKEN>`. Bodies use JSON and are limited to 100 KB. SQL values are parameterized.

| Method | Endpoint | Body |
| --- | --- | --- |
| GET | `/api/admin/session` | — (approved subject, no database access) |
| GET | `/api/admin/projects` | — (only member projects) |
| POST | `/api/admin/projects` | `{ "data": { "id": "acme", "name": "Acme", "domain": "https://example.com" } }` |
| GET | `/api/admin/:resource?project=:projectId` | — |
| GET | `/api/admin/:resource/:uuid?project=:projectId` | — |
| POST | `/api/admin/:resource?project=:projectId` | `{ "data": { ... } }` |
| PUT | `/api/admin/:resource/:uuid?project=:projectId` | `{ "data": { ... }, "version": 1 }` |
| DELETE | `/api/admin/:resource/:uuid?project=:projectId` | `{ "version": 1 }` |

Content endpoints require an explicit project ID; the server never defaults to another project's records. Status codes include 400 invalid data/project, 401 invalid/expired session, 403 missing approval/membership, 404 unknown record, 409 conflicting record/project, 413 payload too large, 415 wrong content type and 503 unavailable configuration/database.

## Hosting and verification

On Vercel, `api/admin/[...path].js` exposes the API and `vercel.json` preserves API routes while serving the SPA. Configure server credentials and build-time frontend Auth0 identifiers, run database setup for the target database, then deploy normally. Static hosting alone cannot run the backend. For other hosts, expose the Node service through an HTTPS reverse proxy at `/api/admin/*` and configure SPA fallback at `/admin`.

A single studio deployment can manage projects on different domains; each website's eventual content integration is separate. Deploying the admin itself on several domains additionally requires Auth0 callback/origin configuration for each admin host.

Run `npm run test:admin`, `node --test tests/*.test.js`, and `npm run build`. Tests cover signed-token validation, approval, project membership, scoped CRUD queries, atomic project creation, image URL resolution, content validation and concurrent-edit protection. A live Neon migration and Auth0/browser flows require configured services and have not been verified here.
