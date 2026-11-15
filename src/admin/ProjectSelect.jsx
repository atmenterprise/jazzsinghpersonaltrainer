import React, { useEffect, useRef, useState } from 'react';

export default function ProjectSelect({ project, projects, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!root.current?.contains(event.target)) setOpen(false); };
    const escape = event => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('focusin', outside);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', outside);
      document.removeEventListener('focusin', outside);
      document.removeEventListener('keydown', escape);
    };
  }, [open]);
  return <div className="admin-project-select" ref={root}>
    <button ref={trigger} type="button" className="admin-project-trigger" aria-label={`Choose project: ${project.name}`} aria-expanded={open} aria-controls="admin-project-options" disabled={disabled} onClick={() => setOpen(value => !value)}>
      <span className="admin-project-mark" aria-hidden="true">▦</span><span id="admin-project-value">{project.name}</span><span aria-hidden="true">{open ? '▴' : '▾'}</span>
    </button>
    {open && <div id="admin-project-options" className="admin-project-options" role="group" aria-label="Choose active project">
      {projects.map(item => <button type="button" key={item.id} disabled={disabled} aria-pressed={item.id === project.id} onClick={() => { onChange(item); setOpen(false); trigger.current?.focus(); }}>
        <span>{item.name}</span>{item.id === project.id && <span aria-hidden="true">✓</span>}
      </button>)}
    </div>}
  </div>;
}
