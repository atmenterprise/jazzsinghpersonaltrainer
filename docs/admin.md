# ATM Content Studio

The admin at `/admin` is branded for ATM Enterprise, the development studio. Its wordmark, yellow (`#FFDE59`), charcoal (`#1A1A1A`), off-white background and Plus Jakarta Sans typography follow [ATM Enterprise](https://atmenterprise.github.io/atm/). The logo is reproduced from the reference site's inline SVG; a standalone copy is at `public/admin/atm-logo.svg`. Fonts load from Google Fonts with system fallbacks.

ATM Content Studio supports multiple projects in one database and one admin deployment. Each project has its own ID, website domain, content and members. The public website remains independent: saved edits appear publicly only after its content integration is connected. No deployment was performed.


## Setup and existing database upgrade

Use Node.js 22+ and install dependencies with `npm install`.

1. Configure a Neon PostgreSQL database and obtain its SSL connection string.
2. Copy `.env.example` to `.env` and replace the database and Auth0 placeholders. For an existing installation, preserve your current Auth0 API audience; the new ATM example is only a default for new installations.
3. Set `ADMIN_PROJECT_OWNER_SUB` to the initial owner's Auth0 **User ID**, such as `auth0|abc123` (not their email). This grants membership in the imported project. They must also hold the Auth0 `manage:content` permission.
4. Run `npm run db:setup`. It creates the project and membership tables, adds a project foreign key to existing content, migrates unassigned content to the imported project, and replaces the old import uniqueness constraint with one scoped by project. Schema changes, backfill and import run in one transaction. Existing content, IDs, versions and edits are preserved. Run this against a Neon development branch first before upgrading a production database.
5. Run `npm run dev`, then open `http://localhost:3000/admin`. Next.js serves the admin, Auth0 endpoints and API in one process.

The initial import uses the existing repository's JSON and defaults to project ID `jazboom`, with its name/domain from `siteConfig.json`. Optional `SEED_PROJECT_SLUG`, `SEED_PROJECT_NAME`, and `SEED_PROJECT_DOMAIN` override this initial project. Keep these stable on reruns. Do not point this site's importer at a different client project; create empty projects through the studio instead.

Setup is rerunnable: already imported rows are preserved; deliberately deleted seed records are recreated. If no owner subject is configured, imported content stays inaccessible until a member is assigned. `node scripts/setup-db.js --check` validates all 57 seed records without connecting to a database.

## Auth0 (Vercel Regular Web Application, admin only)

The admin runs on Next.js App Router with `@auth0/nextjs-auth0`, following the Auth0 Vercel integration guide. It works with Vercel's **Regular Web Application** and no longer needs a SPA client or `VITE_AUTH0_*` variables. Public pages remain unauthenticated. The browser talks to the native Next.js admin API; tokens and all secrets stay on the server in an encrypted HttpOnly session cookie. The SDK handles the authorization-code flow with PKCE, state, nonce, token validation and session encryption.

Set these server environment variables in Vercel's **Preview** environment for preview testing and **Production** for production:

| Variable | Purpose |
| --- | --- |
| `AUTH0_CLIENT_ID` | Regular Web Application Client ID |
| `AUTH0_CLIENT_SECRET` | Regular Web Application client secret, used for server-side code exchange |
| `AUTH0_DOMAIN` | Auth0 hostname or HTTPS tenant origin |
| `AUTH0_SECRET` | Random session encryption secret of at least 32 characters |
| `AUTH0_MANAGEMENT_API_CLIENT_ID` | Optional server-side application's credentials for checking user permissions |
| `AUTH0_MANAGEMENT_API_CLIENT_SECRET` | Matching secret for that Management API application |

The first four are required for signup/login. The Management API pair is used for checking approved users' permissions; authorize that application for the Auth0 Management API's `read:users` scope. It may be a separate machine-to-machine application. Use actual credentials in Preview, not a production-only placeholder. No credential values are returned by the public session-status endpoint or embedded in the Vite build.

In the Auth0 Regular Web Application, enable a database connection with signup allowed. Configure:

| Setting | Local | Vercel preview |
| --- | --- | --- |
| Allowed Callback URLs | `http://localhost:3000/auth/callback` | `https://project-1l6vp-git-refresheddesign-jatayu5.vercel.app/auth/callback` |
| Allowed Logout URLs | `http://localhost:3000/admin` | `https://project-1l6vp-git-refresheddesign-jatayu5.vercel.app/admin` |
| Allowed Web Origins | `http://localhost:3000` | `https://project-1l6vp-git-refresheddesign-jatayu5.vercel.app` |

Add the equivalent production URLs without removing needed existing entries. **The callback is now `/auth/callback`, replacing the previous `/api/admin/auth/callback`.** Keep using `/admin` to open the editor. The callback is handled by the server, not the React router. Redeploy Vercel after changing its environment values.

The app chooses its HTTPS origin by matching the request hostname to trusted `VERCEL_URL`, `VERCEL_BRANCH_URL`, or `VERCEL_PROJECT_PRODUCTION_URL` system variables. For other/custom admin hosts set `APP_BASE_URL` to the complete trusted origin, for example `https://studio.example.com`. It defaults to `http://localhost:3000` locally. Do not use a different port without changing that setting. Never derive an allowed callback from arbitrary forwarded host headers.

Locally, copy `.env.example` to `.env` or `.env.local`, fill in the standard server variables, and run `npm run dev`. Next.js loads both files; `.env.local` overrides `.env`. The database setup command reads `.env` explicitly. Do not duplicate conflicting variables. No frontend Auth0 environment variables are needed.

### Public site and deployment architecture

Only the admin/auth/API layer uses Next.js. The existing public React components and React Router remain the public website. `npm run build:site` builds their Vite bundle into ignored `public/site/` without recursively copying the public folder. Next.js serves the existing images/styles/fonts at their original paths, rewrites Vite's `/assets/*` bundles to `/site/assets/*`, and falls back to the public HTML for public page URLs. The public page source files moved from `src/pages/` to `src/site-pages/` to prevent Next.js from treating them as Pages Router routes; their contents are unchanged.

`npm run dev` builds the public bundle and starts Next at port 3000. For hot reloading while editing public pages, run `npm run dev:site` separately (Vite port 5173); use Next port 3000 for admin testing. Rebuild/restart the main dev command to refresh its public bundle after public-source changes.

On Vercel keep the repository root as the project Root Directory. `vercel.json` sets **Next.js**, build command `npm run build`, output `.next`. Remove obsolete dashboard overrides pointing at `dist` or using `vite build` alone. The build first generates the public bundle, then builds Next.js. Use Node.js 22+. No second Vercel project or manually deployed Express function is required. The obsolete root `api/admin/[...path].js` and Express server have been removed.

Next routes live in `src/app/admin/` and `src/app/api/admin/[...path]/route.ts`. `src/proxy.ts` invokes `auth0.middleware()` only for `/admin/*`, `/api/admin/*`, and `/auth/*`. Public URLs, images, analytics and visitor interactions remain outside Auth0's proxy matcher. `Auth0Provider` wraps only the admin layout. The public website is not replaced with the guide's demonstration login page.

`npm run build:static` still produces the original `dist/` website for GitHub Pages; the workflow uses this command. Static-only hosting cannot run the Next.js admin or API.

### Admin approval

Signup alone never grants editing access. Create or reuse an Auth0 API with permission `manage:content` and assign that permission to an approved user's Admin role. The permission checker uses one of these server-trusted sources:

1. Auth0 Management API: the configured Management API application reads the user's assigned permissions. By default it checks permissions belonging to `https://atm-content-studio-api`. Set optional `AUTH0_AUDIENCE` if your content API uses a different identifier. When set, the login request also requests an API access token, which the server verifies with the existing RS256 JWT validator; configure RBAC and **Add Permissions in the Access Token** for that API.
2. Optional Auth0 Post Login Action: when Management API access is unavailable, add the namespaced ID-token claim shown below and deploy/bind the Action to the Login flow. Assign the dedicated **ATM Content Admin** role only to approved users:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  if (event.authorization?.roles?.includes('ATM Content Admin')) {
    api.idToken.setCustomClaim(
      'https://atmenterprise.github.io/atm/permissions',
      ['manage:content']
    );
  }
};
```

The claim must be generated by an Auth0 Action, not supplied through editable user metadata. With no approval source, signup and login still work, but the account remains pending. Project membership remains separately required for accessing each project's content. A namespaced ID-token claim remains valid for the eight-hour application session; sign out and back in after changing that Action/role. Management API permissions are checked for each authorized request; only its machine access token is cached on the server.

Logout uses the SDK's `/auth/logout` endpoint and returns to `/admin`. Session cookies are HttpOnly, SameSite=Lax, Secure on HTTPS, scoped to the host (the SDK needs the cookie on `/admin`, `/auth` and `/api/admin`), and expire after eight hours without rolling extension. Mutating requests must include an Origin matching the trusted admin origin, protecting cookie-authenticated writes from cross-site requests. The old shared token is not accepted; explicit bearer clients can still use the existing API audience/JWT verification with the same origin requirement for mutations.

Auth0 stores passwords, verification and account recovery. PostgreSQL stores only Auth0 subject identifiers for project memberships, not credentials or sessions.

Official references: [Next.js SDK](https://github.com/auth0/nextjs-auth0), [SDK configuration](https://auth0.github.io/nextjs-auth0/classes/server.Auth0Client.html), [viewing user permissions](https://auth0.com/docs/manage-users/access-control/configure-core-rbac/rbac-users/view-user-permissions).

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

Content/project endpoints require an approved server session (HttpOnly cookie), plus project membership for content operations. Mutations must originate from the trusted studio origin. Bodies use JSON and are limited to 100 KB. SQL values are parameterized.

| Method | Endpoint | Body |
| --- | --- | --- |
| GET | `/api/admin/auth/status` | — (public session state; no credentials/tokens) |
| GET | `/auth/login` | — (append `?screen_hint=signup` for signup) |
| GET | `/auth/callback` | OAuth callback handled by the server SDK |
| GET | `/auth/logout` | SDK logout; returns to `/admin` |
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

On Vercel the Next.js App Router exposes the admin API directly, and `next.config.mjs` keeps API/auth/admin paths out of the public SPA fallback. Configure standard server-side Auth0 variables, run database setup for the target database, and redeploy. Auth0 values are read at server runtime; none are bundled into the frontend. Run `npm run build` then `npm start` for a local production check. Static hosting alone cannot run this backend.

A single studio deployment can manage projects on different domains; each website's eventual content integration is separate. Deploying the admin itself on several domains additionally requires Auth0 callback/origin configuration for each admin host.

Run `npm run test:admin`, `node --test tests/*.test.js`, `npm run typecheck`, and `npm run build`. With `npm start` running, `npm run test:smoke` checks all public page URLs, key assets, JSON session status, unauthorized API access and Auth0 login/logout initiation (when configured). Tests cover standard server configuration, native Next.js JSON session endpoints and real SDK encrypted-cookie validation, callback-origin validation, cross-site write rejection, Management API credential isolation and approval, signed-token validation, project membership, scoped CRUD queries, atomic project creation, image URL resolution, content validation and concurrent-edit protection. A live Neon migration and Auth0/browser flows require configured services and have not been verified here.
