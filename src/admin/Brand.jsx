import React from 'react';
// The inline wordmark and lettering match ATM Enterprise's published logo.
export default function Brand({ compact = false }) {
  return <a className="admin-brand" href="https://atmenterprise.github.io/atm/" target="_blank" rel="noopener noreferrer" aria-label="ATM Content Studio by ATM Enterprise">
    <svg viewBox={compact ? "0 0 145 80" : "0 0 280 80"} width={compact ? "52" : "175"} height={compact ? "29" : "50"} fill="none" role="img" aria-label="ATM — Apps That Matter">
      <g fill="#1a1a1a" fontFamily="'Plus Jakarta Sans', Inter, sans-serif">
        <text x="10" y="56" fontWeight="900" fontSize="68" letterSpacing="-3.5">atm</text>
        {!compact && <g fontWeight="700"><text x="152" y="28" fontSize="13" letterSpacing="4.8">APPS</text><text x="152" y="46" fontSize="13" letterSpacing="4.8">THAT</text><text x="152" y="62" fontSize="10" letterSpacing="2.1">MATTER</text></g>}
      </g>
    </svg>
    <span className={compact ? "admin-brand-compact-name" : undefined}>{compact ? <>Content<br />Studio</> : "ATM CONTENT STUDIO"}</span>
  </a>;
}
