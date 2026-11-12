import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useAdminAuth } from './session';
import { resources, safeUrl } from '../../server/content';
import './admin.css';
import Brand from './Brand';
import ProjectSelect from './ProjectSelect';
import { projectAssetUrl } from './projectAssets';
const names = { programmes: 'Programmes & Services', testimonials: 'Testimonials', about: 'About Me', specialistareas: 'Specialist Areas', programme_pages: 'Programme Pages' };
const labels = {
  audience_title: 'Who it’s for — heading', audience_content: 'Who it’s for — content',
  included_title: 'What’s included — heading', included_content: 'What’s included — content',
  results_title: 'Results — heading', results_content: 'Results — content',
  investment_title: 'Investment — heading', investment_content: 'Investment — content', introduction: 'Introduction', cta_text: 'Booking button text', image_url: 'Image URL', short_description: 'Short description', name: 'Name', program_id: 'Service ID', page_url: 'Page slug', image: 'Client photo URL', link: 'Original story URL', featured: 'Feature on homepage', url: 'Image URL', alt: 'Alternative text', focus: 'Story focus', headline: 'Homepage headline', summary: 'Homepage summary', excerpt: 'Story excerpt' };
const blank = resource => ({
  ...Object.fromEntries(Object.entries(resources[resource]).map(([key, [type]]) => [key, type === 'boolean' ? false : ''])),
  ...(['about', 'specialistareas'].includes(resource) ? { image_url: resource === 'about' ? 'img/profile/profile.jpg' : 'img/icons/treadmill.gif' } : {}),
});
const readOnlyField = (resource, key) => resource === 'programmes'
  ? !['name', 'short_description'].includes(key)
  : resource === 'programme_pages' ? key === 'page_url' : ['about', 'specialistareas'].includes(resource) && ['image_url', 'alt'].includes(key);
export default function Admin({ project, projects, onProjectChange, onCreateProject }) {
  const { logout, loginWithRedirect, user } = useAdminAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [programmesOpen, setProgrammesOpen] = useState(true);
  const profileRef = useRef(null);
  const profileTriggerRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = user?.name || user?.email || 'Studio admin';
  useEffect(() => {
    if (!profileOpen) return;
    const closeOutside = event => {
      if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
    };
    const closeOnEscape = event => {
      if (event.key === 'Escape') { setProfileOpen(false); profileTriggerRef.current?.focus(); }
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('focusin', closeOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('focusin', closeOutside);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [profileOpen]);
  const [resource, setResource] = useState('programmes');
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState(null);
  const [search, setSearch] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [reload, setReload] = useState(0);
  const visibleRows = rows.filter(row => (!featuredOnly || row.data.featured === true) && JSON.stringify(row.data).toLowerCase().includes(search.toLowerCase()));
  const dirty = draft && JSON.stringify(draft) !== JSON.stringify(selected?.data || blank(resource));
  const canLeave = () => !dirty || window.confirm('Discard your unsaved changes?');
  const api = useCallback(async (path, options = {}, signal) => {
    if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
    const response = await fetch(`/api/admin/${path}?project=${encodeURIComponent(project.id)}`, { ...options, signal, credentials: 'same-origin', headers: { 'Content-Type': 'application/json' } });
    const result = await response.json().catch(() => ({ error: 'API unavailable. Start the backend service.' }));
    if (!response.ok) throw new Error(result.error || 'Request failed.');
    return result;
  }, [project.id]);
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
  return <div className={`admin-root admin-shell${sidebarCollapsed ? ' admin-sidebar-collapsed' : ''}`}>
    <aside className="admin-sidebar">
      <div className="admin-sidebar-header"><Brand compact={sidebarCollapsed} /></div><p className="admin-eyebrow">WORKSPACE</p>
      <nav id="admin-sidebar-navigation" aria-label="Admin sections">
        <div className="admin-nav-group">
          <button type="button" className="admin-nav-group-toggle" aria-label="Programmes" title={sidebarCollapsed ? 'Programmes' : undefined} aria-expanded={!sidebarCollapsed && programmesOpen} aria-controls="admin-programme-navigation" data-active={['programmes', 'programme_pages'].includes(resource) || undefined} disabled={busy} onClick={() => { if (sidebarCollapsed) { setSidebarCollapsed(false); setProgrammesOpen(true); } else setProgrammesOpen(open => !open); }}>
            <span aria-hidden="true">▦</span><span className="admin-sidebar-label">Programmes</span><span className="admin-sidebar-label admin-nav-chevron" aria-hidden="true">{programmesOpen ? '▴' : '▾'}</span>
          </button>
          <div id="admin-programme-navigation" className="admin-nav-submenu" hidden={sidebarCollapsed || !programmesOpen}>
            {['programmes', 'programme_pages'].map(key => <button type="button" key={key} aria-current={key === resource ? 'page' : undefined} disabled={busy} onClick={() => { if (!canLeave()) return; setResource(key); setFeaturedOnly(false); setSearch(''); setNotice(''); }}>{names[key]}</button>)}
          </div>
        </div>
        {['testimonials', 'about', 'specialistareas'].map((key, index) => <button type="button" key={key} aria-label={names[key]} title={sidebarCollapsed ? names[key] : undefined} aria-current={key === resource ? 'page' : undefined} disabled={busy} onClick={() => { if (!canLeave()) return; setResource(key); setFeaturedOnly(false); setSearch(''); setNotice(''); }}><span aria-hidden="true">{['♡', '◉', '✦'][index]}</span><span className="admin-sidebar-label">{names[key]}</span></button>)}
      </nav>
      <div className="admin-sidebar-footer"><div className="admin-sidebar-bottom"><p>Copyright 2026 ATM Enterprise</p></div><button type="button" className="admin-sidebar-toggle" aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!sidebarCollapsed} aria-controls="admin-sidebar-navigation" title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} onClick={() => setSidebarCollapsed(collapsed => !collapsed)}><span aria-hidden="true">{sidebarCollapsed ? '»' : '«'}</span></button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-workspace-header" aria-label="Workspace and project">
        <div className="admin-workspace-top">
          <nav className="admin-workspace-context admin-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><button type="button" className="admin-breadcrumb-home" aria-label="Admin home" title="Admin home" disabled={busy} onClick={() => { if (!canLeave()) return; setResource('programmes'); setProgrammesOpen(true); setFeaturedOnly(false); setSearch(''); setNotice(''); }}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg></button></li>
              {['programmes', 'programme_pages'].includes(resource) && <li><span className="admin-breadcrumb-separator" aria-hidden="true">/</span><button type="button" disabled={busy} onClick={() => { setSidebarCollapsed(false); setProgrammesOpen(true); }}>Programmes</button></li>}
              <li><span className="admin-breadcrumb-separator" aria-hidden="true">/</span><strong aria-current="page">{names[resource]}</strong></li>
            </ol>
          </nav>
          <div className="admin-active-project">
            <ProjectSelect project={project} projects={projects} disabled={busy} onChange={next => { if (canLeave()) { setProfileOpen(false); onProjectChange(next); } }} />
          </div>
          <div className="admin-profile-menu" ref={profileRef}>
            <button type="button" ref={profileTriggerRef} className="admin-profile-trigger" aria-expanded={profileOpen} aria-controls="admin-profile-dropdown" onClick={() => setProfileOpen(open => !open)}>
              <span className="admin-person-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.5" /><path d="M4.5 21v-2a7.5 7.5 0 0 1 15 0v2" /></svg></span>
              <span className="admin-profile-name">{displayName}</span><span aria-hidden="true">{profileOpen ? '▴' : '▾'}</span>
            </button>
            {profileOpen && <div id="admin-profile-dropdown" className="admin-profile-dropdown">
              <strong>{displayName}</strong>{user?.email && user.email !== displayName && <span>{user.email}</span>}
              <div className="admin-profile-role"><span>Workspace role</span><strong>Content admin</strong></div>
              <div className="admin-profile-project">
                <span>Project website</span>
                <a href={project.domain} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} website (opens in a new tab)`}>{new URL(project.domain).host} <span aria-hidden="true">↗</span></a>
              </div>
              <button type="button" className="admin-profile-new-project" disabled={busy} onClick={() => { if (canLeave()) { setProfileOpen(false); onCreateProject(); } }}><span aria-hidden="true">＋</span>New Project</button>
              <button type="button" disabled={busy} onClick={signOut}><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 4H4v16h5M14 7l5 5-5 5M8 12h11" /></svg>Sign out</button>
            </div>}
          </div>
        </div>
      </header>
      <div className="admin-heading"><div><p className="admin-eyebrow">MAKE IT YOURS</p><h1>{names[resource]}</h1><p>{resource === 'images' ? 'A fresh look starts with the right image.' : resource === 'testimonials' ? 'Celebrate the people behind the progress.' : resource === 'programmes' ? 'Keep your services and offerings up to date.' : resource === 'about' ? 'Tell your story and introduce yourself.' : resource === 'programme_pages' ? 'Edit the introductions and detailed content of your programme pages.' : 'Manage your specialist areas and expertise.'}</p></div>
        {(['testimonials', 'specialistareas'].includes(resource) || resource === 'about' && !rows.length) && <button className="admin-primary" disabled={busy || loading || !!error && !rows.length} onClick={() => { if (canLeave()) { setSelected(null); setDraft(blank(resource)); setNotice(''); } }}>+ Add {resource === 'testimonials' ? 'story' : 'record'}</button>}</div>
      {error && <div className="admin-error" role="alert">{error} <button disabled={busy || loading} onClick={() => { if (canLeave()) setReload(r => r + 1); }}>Reload records</button> <button disabled={busy} onClick={signInAgain}>Sign in again</button></div>}
      {notice && <p className="admin-notice" role="status">{notice}</p>}
      <div className="admin-workspace"><section className="admin-records" aria-label="Content records"><div className="admin-list-header"><h2>All {names[resource].toLowerCase()} <span>{rows.length}</span></h2><label className="admin-search">Search records<input type="search" placeholder="Search your content…" value={search} onChange={e => setSearch(e.target.value)} /></label></div>
        {resource === 'testimonials' && <div className="admin-testimonial-filters" role="group" aria-label="Filter testimonials"><button type="button" aria-pressed={!featuredOnly} onClick={() => setFeaturedOnly(false)}>All <span>{rows.length}</span></button><button type="button" aria-pressed={featuredOnly} onClick={() => setFeaturedOnly(true)}>Featured <span>{rows.filter(row => row.data.featured).length}</span></button></div>}
        {loading ? <p role="status" className="admin-empty">Loading database records…</p> : visibleRows.map(row => {
          const d = row.data; const thumb = d.image_url || d.image || (resource === 'images' ? d.url : '');
          return <button disabled={busy} className={`admin-record ${selected?.id === row.id ? 'is-selected' : ''}`} key={row.id} onClick={() => select(row)}>
            {thumb && safeUrl(thumb, true) ? <img src={projectAssetUrl(thumb, project.domain)} alt="" loading="lazy" referrerPolicy="no-referrer" /> : <span className="admin-record-icon" aria-hidden="true">{resource === 'testimonials' ? '♡' : '✎'}</span>}
            <span><strong>{d.label || d.name || d.title}</strong><small>{d.location || d.author || d.short_description || d.value}</small>{d.featured && <em>Featured</em>}</span><span aria-hidden="true">›</span></button>;
        })}
        {!loading && !rows.length && !error && <p className="admin-empty">No records yet. Add your first record to get started.</p>}
        {!loading && rows.length > 0 && !visibleRows.length && <p className="admin-empty">No records match your search.</p>}
      </section><section className="admin-editor" aria-label="Record editor">{draft ? <form onSubmit={save}><div className="admin-editor-heading"><p className="admin-eyebrow">{selected ? 'EDIT RECORD' : 'NEW RECORD'}</p><h2>{draft.label || draft.name || draft.title || 'Make something great'}</h2></div>
        {imageSrc && <div className="admin-preview"><img src={imageSrc} alt={draft.alt || 'Selected image preview'} referrerPolicy="no-referrer" /><span>IMAGE PREVIEW</span></div>}
        <fieldset disabled={busy}>
        {resource === 'testimonials' && <div className="admin-featured-control"><div><strong>Featured testimonials</strong><p>{draft.featured ? 'Included in the homepage featured section.' : 'Available in all stories. Add it to feature it on the homepage.'}</p></div><button type="button" aria-pressed={!!draft.featured} onClick={() => setDraft({ ...draft, featured: !draft.featured })}>{draft.featured ? 'Remove from featured' : 'Add to featured'}</button><small>Save changes to update the homepage. Removing from featured keeps the testimonial in all stories.</small></div>}
        {Object.entries(resources[resource]).filter(([key]) => key !== 'featured').map(([key, [type, max]]) => <label key={key} className={readOnlyField(resource, key) ? 'admin-field-disabled' : type === 'boolean' ? 'admin-check' : ''}>
          {labels[key] || key.charAt(0).toUpperCase() + key.slice(1)}{readOnlyField(resource, key) && <span className="admin-field-status">Read only</span>}
          {type === 'boolean' ? <input disabled={readOnlyField(resource, key)} type="checkbox" checked={!!draft[key]} onChange={e => setDraft({ ...draft, [key]: e.target.checked })} /> : (['description', 'short_description', 'summary', 'excerpt', 'introduction'].includes(key) || key.endsWith('_content')) ? <textarea disabled={readOnlyField(resource, key)} rows={key === 'description' ? 9 : 4} maxLength={max} value={draft[key] || ''} onChange={e => setDraft({ ...draft, [key]: e.target.value })} /> : <input disabled={readOnlyField(resource, key)} maxLength={max} value={draft[key] || ''} onChange={e => setDraft({ ...draft, [key]: e.target.value })} />}
        </label>)}
        {resource === 'programme_pages' && <p className="admin-hint">Separate paragraphs with a blank line. Start list items with “- ”. Use [booking](/booking#book) for a booking link. Leave a section’s content empty to hide it.</p>}
        {resource === 'testimonials' && image && <p className="admin-hint">Use an HTTPS image URL from your media host, or an existing img/ path. Upload files to your media host first.</p>}
        <div className="admin-editor-actions"><button className="admin-primary" type="submit">{busy ? 'Saving…' : 'Save changes'}</button><button type="button" onClick={() => { if (canLeave()) { setDraft(null); setSelected(null); } }}>Cancel</button>{selected && ['testimonials', 'specialistareas'].includes(resource) && <button className="admin-delete" type="button" onClick={remove}>Delete</button>}</div></fieldset>
        {selected && <p className="admin-hint">Last saved {new Date(selected.updated_at).toLocaleString()} · Version {selected.version}</p>}
      </form> : <div className="admin-editor-empty"><span aria-hidden="true">✎</span><h2>A little change.<br />A fresh impression.</h2><p>Select a record to edit its details, or add something new.</p></div>}</section></div>
    </main>
  </div>;
}
