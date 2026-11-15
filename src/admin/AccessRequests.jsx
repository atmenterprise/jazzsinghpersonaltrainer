import React, { useEffect, useState } from 'react';
import Brand from './Brand';

export default function AccessRequests({ onClose }) {
  const [data, setData] = useState({ requests: [], projects: [] });
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError('');
    fetch('/api/admin/access-requests', { signal: controller.signal, credentials: 'same-origin' })
      .then(async response => { const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Unable to load requests.'); return result; })
      .then(setData).catch(error => { if (!controller.signal.aborted) setError(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [reload]);
  async function act(action, row) {
    if (action === 'deny' && !window.confirm(`Deny the access request for ${row.email}? The user will receive an email.`)) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const response = await fetch(`/api/admin/access-requests/${action}`, { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: row.user_id, projectId: projects[row.user_id] }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to process request.');
      setNotice(result.message);
      setReload(value => value + 1);
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  return <main className="admin-root admin-access-page"><div className="admin-access-panel">
    <Brand /><p className="admin-eyebrow">ADMINISTRATORS ONLY</p><h1>Access requests</h1>
    <p>Review pending requests. Select a project to grant content access. Approving an account does not make it an administrator.</p>
    <div className="admin-access-actions"><button disabled={busy} onClick={onClose}>Back to workspace</button><button disabled={busy || loading} onClick={() => setReload(value => value + 1)}>Refresh requests</button></div>
    {error && <p role="alert" className="admin-error">{error}</p>}
    {notice && <p role="status" className="admin-notice">{notice}</p>}
    {loading ? <p role="status">Loading requests…</p> : !data.requests.length ? <p>No pending access requests.</p> : data.requests.map(row => <section className="admin-access-request" key={row.user_id}>
      <h2>{row.name || row.email}</h2><p>{row.email}</p><code className="admin-user-id">{row.user_id}</code>
      <p>Requested {new Date(row.created_at).toLocaleString()} · Awaiting approval</p>
      <p>{row.notifications_sent}/2 signup emails sent</p>
      <label>Project<select value={projects[row.user_id] || ''} disabled={busy} onChange={event => setProjects({ ...projects, [row.user_id]: event.target.value })}><option value="">Select a project</option>{data.projects.map(project => <option key={project.id} value={project.id}>{project.name} ({project.id})</option>)}</select></label>
      <div className="admin-access-actions"><button className="admin-primary" disabled={busy || !projects[row.user_id]} onClick={() => act('approve', row)}>Approve access</button>
      <button className="admin-delete" disabled={busy} onClick={() => act('deny', row)}>Deny request</button>
      {row.notifications_sent < 2 && <button disabled={busy} onClick={() => act('retry', row)}>Retry signup emails</button>}</div>
    </section>)}
  </div></main>;
}
