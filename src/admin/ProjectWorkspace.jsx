import React, { useEffect, useState } from 'react';
import { useAdminAuth } from './session';
import Admin from './Admin';
import Brand from './Brand';
export default function ProjectWorkspace() {
  const { logout } = useAdminAuth();
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);
  const [draft, setDraft] = useState({ id: '', name: '', domain: '' });
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    (async () => {
      try {
        const response = await fetch('/api/admin/projects', { signal: controller.signal, credentials: 'same-origin' });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Unable to load projects.');
        if (!controller.signal.aborted) { setProjects(result); setProject(result[0] || null); }
      } catch (e) { if (!controller.signal.aborted) setError(e.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [retry]);
  async function create(event) {
    event.preventDefault(); setSaving(true); setError('');
    try {
      const response = await fetch('/api/admin/projects', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: draft }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to create project.');
      setProjects(old => [...old, result]); setProject(result); setCreating(false); setDraft({ id: '', name: '', domain: '' });
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  }
  async function signOut() {
    try { await logout({ logoutParams: { returnTo: `${window.location.origin}/admin` } }); }
    catch { setError('Unable to sign out. Please try again.'); }
  }
  if (loading || !project || creating) return <main className="admin-root admin-login"><div className="admin-auth-card admin-project-card"><Brand />
    <p className="admin-eyebrow">YOUR PROJECTS. ONE WORKSPACE.</p><h1>{loading ? 'Opening the studio…' : creating ? 'Create a project.' : 'Welcome to your studio.'}</h1>
    {error && <p role="alert">{error}</p>}
    {loading ? <p role="status">Loading your projects.</p> : creating ? <form onSubmit={create}>
      <p>Give your project a name and connect its domain.</p><fieldset disabled={saving}>
        <label>Project name<input autoFocus required maxLength={150} value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} placeholder="Acme Studio" /></label>
        <label>Project ID<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={80} value={draft.id} onChange={e => setDraft({ ...draft, id: e.target.value })} placeholder="acme-studio" /><small>A unique ID using lowercase letters, numbers and hyphens.</small></label>
        <label>Website domain<input type="url" required value={draft.domain} onChange={e => setDraft({ ...draft, domain: e.target.value })} placeholder="https://example.com" /></label>
        <button className="admin-primary" type="submit">{saving ? 'Creating…' : 'Create project →'}</button><button type="button" onClick={() => { setCreating(false); setError(''); }}>Cancel</button>
      </fieldset></form> : <><p>{error ? 'Check your connection and try again.' : 'Manage content for every website you build. Create a project to get started, or ask your team to grant access to an existing one.'}</p>{error ? <button onClick={() => setRetry(v => v + 1)}>Try again</button> : <button className="admin-primary" onClick={() => setCreating(true)}>+ Create project</button>}</>}
    {!saving && <button onClick={signOut}>Sign out</button>}
    <small>Developed by ATM Enterprise · Apps That Matter</small>
  </div></main>;
  return <Admin key={project.id} project={project} projects={projects} onProjectChange={setProject} onCreateProject={() => { setCreating(true); setError(''); }} />;
}
