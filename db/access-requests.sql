CREATE TABLE IF NOT EXISTS admin_access_requests (
  user_id text PRIMARY KEY,
  email text NOT NULL,
  name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  approved_at timestamptz,
  approved_by text,
  project_id text REFERENCES admin_projects(id)
);
CREATE TABLE IF NOT EXISTS admin_access_notifications (
  user_id text NOT NULL REFERENCES admin_access_requests(user_id),
  recipient_kind text NOT NULL CHECK (recipient_kind IN ('owner', 'applicant')),
  sent_at timestamptz,
  claimed_until timestamptz,
  attempts integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, recipient_kind)
);
