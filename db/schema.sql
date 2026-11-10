-- ATM Content Studio. Auth0 subjects map to projects, never to passwords.
CREATE TABLE IF NOT EXISTS admin_projects (
  id text PRIMARY KEY CHECK (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text NOT NULL,
  domain text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS admin_project_members (
  project_id text NOT NULL REFERENCES admin_projects(id) ON DELETE CASCADE,
  auth0_sub text NOT NULL,
  PRIMARY KEY(project_id, auth0_sub)
);
CREATE INDEX IF NOT EXISTS admin_project_members_subject_idx ON admin_project_members(auth0_sub);
CREATE TABLE IF NOT EXISTS admin_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource text NOT NULL CHECK (resource IN ('programmes', 'testimonials', 'images', 'settings')),
  source_key text,
  data jsonb NOT NULL CHECK (jsonb_typeof(data) = 'object'),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
-- This also upgrades the original single-project content table without deleting records.
ALTER TABLE admin_content ADD COLUMN IF NOT EXISTS project_id text REFERENCES admin_projects(id) ON DELETE CASCADE;
ALTER TABLE admin_content DROP CONSTRAINT IF EXISTS admin_content_resource_source_key_key;
CREATE UNIQUE INDEX IF NOT EXISTS admin_content_project_source_idx ON admin_content(project_id, resource, source_key);
CREATE INDEX IF NOT EXISTS admin_content_project_resource_idx ON admin_content(project_id, resource, created_at, id);
COMMENT ON TABLE admin_content IS 'Content isolated by project. source_key makes initial imports idempotent.';

ALTER TABLE admin_content DROP CONSTRAINT IF EXISTS admin_content_resource_check;
ALTER TABLE admin_content ADD CONSTRAINT admin_content_resource_check
  CHECK (resource IN ('programmes', 'testimonials', 'images', 'settings', 'about', 'specialistareas', 'programme_pages'));
