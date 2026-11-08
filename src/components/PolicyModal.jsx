import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import PrivacyContent from './PrivacyContent';
import DisclaimerContent from './DisclaimerContent';

export default function PolicyModal({ policy, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, []);

  const title = policy === 'disclaimer' ? 'Disclaimer' : policy === 'gdpr' ? 'GDPR & privacy policy' : 'Privacy policy';

  return createPortal(
    <dialog ref={dialogRef} className="policy-modal" aria-labelledby="policy-modal-title" onCancel={onClose} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
    }}>
      <div className="policy-modal-header">
        <h2 id="policy-modal-title">{title}</h2>
        <button type="button" className="policy-close" onClick={onClose} aria-label="Close policy" autoFocus>×</button>
      </div>
      <div className="policy-modal-body">
        {policy === 'disclaimer' ? <DisclaimerContent /> : <PrivacyContent />}
      </div>
      <div className="policy-modal-footer"><button type="button" className="btn btn-default" onClick={onClose}>Close</button></div>
    </dialog>, document.body
  );
}
