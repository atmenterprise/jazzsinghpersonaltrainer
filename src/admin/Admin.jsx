import React, { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { resources, safeUrl } from '../../server/content';
import './admin.css';
import Brand from './Brand';
import { projectAssetUrl } from './projectAssets';
const names = { programmes: 'Programmes & services', testimonials: 'Testimonials', images: 'Image library', settings: 'Site settings' };
const labels = { image_url: 'Image URL', short_description: 'Short description', name: 'Name', program_id: 'Service ID', page_url: 'Page slug', image: 'Client photo URL', link: 'Original story URL', featured: 'Feature on homepage', url: 'Image URL', alt: 'Alternative text', focus: 'Story focus', headline: 'Homepage headline', summary: 'Homepage summary', excerpt: 'Story excerpt' };
const blank = resource => Object.fromEntries(Object.entries(resources[resource]).map(([key, [type]]) => [key, type === 'boolean' ? false : '']));
export default function Admin({ project, projects, onProjectChange, onCreateProject }) {
  const { getAccessTokenSilently, logout, loginWithRedirect, user } = useAuth0();
  const [resource, setResource] = useState('images');
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const dirty = draft && JSON.stringify(draft) !== JSON.stringify(selected?.data || blank(resource));
  const canLeave = () => !dirty || window.confirm('Discard your unsaved changes?');
  const api = useCallback(async (path, options = {}, signal) => {
    const token = await getAccessTokenSilently();
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const response = await fetch(`/api/admin/${path}?project=${encodeURIComponent(project.id)}`, { ...options, signal, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
    const result = await response.json().catch(() => ({ error: 'API unavailable. Start the backend service.' }));
    if (!response.ok) throw new Error(result.error || 'Request failed.');
    return result;
  }, [getAccessTokenSilently, project.id]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(''); setRows([]); setDraft(null); setSelected(null);
    api(resource, {}, controller.signal).then(setRows).catch(e => { if (e.name !== 'AbortError') setError(e.message); }).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [api, resource, reload]);
  useEffect(() => {
    const beforeUnload = e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', beforeUnload);
    return () => window.removeEventListener('beforeunload', beforeUnload);
  }, [dirty]);
  function select(row) { if (!canLeave()) return; setSelected(row); setDraft({ ...row.data }); setError(''); setNotice(''); }
  async function save(event) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('');
    try {
      const result = await api(`${resource}${selected ? `/${selected.id}` : ''}`, { method: selected ? 'PUT' : 'POST', body: JSON.stringify({ data: draft, version: selected?.version }) });
      setRows(old => selected ? old.map(r => r.id === selected.id ? result : r) : [...old, result]);
      setSelected(result); setDraft({ ...result.data }); setNotice('Changes saved to the database.');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function remove() {
    if (!window.confirm('Permanently delete this record?')) return;
    setBusy(true); setError(''); setNotice('');
    try {
      await api(`${resource}/${selected.id}`, { method: 'DELETE', body: JSON.stringify({ version: selected.version }) });
      setRows(old => old.filter(r => r.id !== selected.id)); setDraft(null); setSelected(null); setNotice('Record deleted.');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  const image = draft?.image_url || draft?.image || (resource === 'images' ? draft?.url : '');
  const imageSrc = image && safeUrl(image, true) ? projectAssetUrl(image, project.domain) : '';
  async function signOut() {
    if (!canLeave()) return;
    try { await logout({ logoutParams: { returnTo: `${window.location.origin}/admin` } }); }
    catch { setError('Unable to sign out. Please try again.'); }
  }
  async function signInAgain() {
    if (!canLeave()) return;
    try { await loginWithRedirect(); }
    catch { setError('Unable to open sign in. Please try again.'); }
  }
  return <div className="admin-root admin-shell">
    <aside className="admin-sidebar"><Brand /><p className="admin-eyebrow">WORKSPACE</p>
      <nav aria-label="Admin sections">{Object.entries(names).map(([key, name], index) => <button key={key} aria-current={key === resource ? 'page' : undefined} disabled={busy} onClick={() => { if (!canLeave()) return; setResource(key); setSearch(''); setNotice(''); }}><span aria-hidden="true">{['▦', '♡', '▧', '⚙'][index]}</span>{name}</button>)}</nav>
      <div className="admin-sidebar-bottom"><p>Developed by ATM Enterprise.
Apps That Matter.</p><button disabled={busy} onClick={signOut}>Sign out ↗</button></div>
    </aside>
    <main className="admin-main"><div className="admin-topbar"><span>{user?.email || user?.name} · ATM Content Studio / <strong>{names[resource]}</strong></span><button disabled={busy} className="admin-signout" onClick={signOut}>Sign out ↗</button></div>
      <div className="admin-project-bar">
        <label>ACTIVE PROJECT<select value={project.id} disabled={busy} onChange={event => { if (canLeave()) onProjectChange(projects.find(p => p.id === event.target.value)); }}>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <a href={project.domain} target="_blank" rel="noopener noreferrer">{new URL(project.domain).host} ↗</a>
        <button disabled={busy} onClick={() => { if (canLeave()) onCreateProject(); }}>+ New project</button>
      </div>
      <div className="admin-heading"><div><p className="admin-eyebrow">MAKE IT YOURS</p><h1>{names[resource]}</h1><p>{resource === 'images' ? 'A fresh look starts with the right image.' : resource === 'testimonials' ? 'Celebrate the people behind the progress.' : resource === 'programmes' ? 'Keep your services and offerings up to date.' : 'Manage your brand and contact details.'}</p></div>
        <button className="admin-primary" disabled={busy || loading || !!error && !rows.length} onClick={() => { if (canLeave()) { setSelected(null); setDraft(blank(resource)); setNotice(''); } }}>+ Add {resource === 'testimonials' ? 'story' : 'record'}</button></div>
      <div className="admin-note"><strong>{project.name}</strong> Content is saved to this project. Website updates appear when its content integration is connected.</div>
      {error && <div className="admin-error" role="alert">{error} <button disabled={busy || loading} onClick={() => { if (canLeave()) setReload(r => r + 1); }}>Reload records</button> <button disabled={busy} onClick={signInAgain}>Sign in again</button></div>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <div className="admin-workspace"><section className="admin-records" aria-label="Content records"><div className="admin-list-header"><h2>All {names[resource].toLowerCase()} <span>{rows.length}</span></h2><label className="admin-search">Search records<input type="search" placeholder="Search your content…" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
        {loading ? <p role="status" className="admin-empty">Loading database records…</p> : rows.filter(row => JSON.stringify(row.data).toLowerCase().includes(search.toLowerCase())).map(row => {
          const d = row.data; const thumb = d.image_url || d.image || (resource === 'images' ? d.url : '');
          return <button disabled={busy} className={`admin-record ${selected?.id === row.id ? 'is-selected' : ''}`} key={row.id} onClick={() => select(row)}>
            {thumb && safeUrl(thumb, true) ? <img src={projectAssetUrl(thumb, project.domain)} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <span className="admin-record-icon" aria-hidden="true">{resource === 'testimonials' ? '♡' : '✎'}</span>}
            <span><strong>{d.label || d.name || d.title}</strong><small>{d.location || d.author || d.short_description || d.value}</small>{d.featured && <em>Featured</em>}</span><span aria-hidden="true">›</span></button>;
        })}
        {!loading && !rows.length && !error && <p className="admin-empty">No records yet. Add your first record to get started.</p>}
        {!loading && rows.length > 0 && !rows.some(row => JSON.stringify(row.data).toLowerCase().includes(search.toLowerCase())) && <p className="admin-empty">No records match your search.</p>}
      </section><section className="admin-editor" aria-label="Record editor">{draft ? <form onSubmit={save}><div className="admin-editor-heading"><p className="admin-eyebrow">{selected ? 'EDIT RECORD' : 'NEW RECORD'}</p><h2>{draft.label || draft.name || draft.title || 'Make something great'}</h2></div>
        {imageSrc && <div className="admin-preview"><img src={imageSrc} alt={draft.alt || 'Selected image preview'} referrerPolicy="no-referrer" /><span>IMAGE PREVIEW</span></div>}
        <fieldset disabled={busy}>{Object.entries(resources[resource]).map(([key, [type, max]]) => <label key={key} className={type === 'boolean' ? 'admin-check' : ''}>
          {labels[key] || key.charAt(0).toUpperCase() + key.slice(1)}
          {type === 'boolean' ? <input type="checkbox" checked={!!draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.checked })} /> : ['description', 'short_description', 'summary', 'excerpt'].includes(key) ? <textarea rows={key === 'description' ? 9 : 4} maxLength={max} value={draft[key] || ''} onChange={e => setDraft({ ...draft, [key]: e.target.value })} /> : <input maxLength={max} value={draft[key] || ''} onChange={e => setDraft({ ...draft, [key]: e.target.value })} />}
        </label>)}
        {image && <p className="admin-hint">Use an HTTPS image URL from your media host, or an existing img/ path. Upload files to your media host first.</p>}
        <div className="admin-editor-actions"><button className="admin-primary" type="submit">{busy ? 'Saving…' : 'Save changes'}</button><button type="button" onClick={() => { if (canLeave()) { setDraft(null); setSelected(null); } }}>Cancel</button>{selected && <button className="admin-delete" type="button" onClick={remove}>Delete</button>}</div></fieldset>
        {selected && <p className="admin-hint">Last saved {new Date(selected.updated_at).toLocaleString()} · Version {selected.version}</p>}
      </form> : <div className="admin-editor-empty"><span aria-hidden="true">✎</span><h2>A little change.<br />A fresh impression.</h2><p>Select a record to edit its details, or add something new.</p></div>}</section></div>
    </main>
  </div>;
}
