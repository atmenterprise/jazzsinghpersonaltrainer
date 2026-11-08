import React from 'react';
// The inline wordmark and lettering match ATM Enterprise's published logo.
export default function Brand() {
  return <a className="admin-brand" href="https://atmenterprise.github.io/atm/" target="_blank" rel="noopener noreferrer" aria-label="ATM Content Studio by ATM Enterprise">
    <svg viewBox="0 0 280 80" width="175" height="50" fill="none" role="img" aria-label="ATM — Apps That Matter">
      <g fill="#1a1a1a" fontFamily="'Plus Jakarta Sans', Inter, sans-serif">
        <text x="10" y="56" fontWeight="900" fontSize="68" letterSpacing="-3.5">atm</text>
        <g fontWeight="700"><text x="152" y="28" fontSize="13" letterSpacing="4.8">APPS</text><text x="152" y="46" fontSize="13" letterSpacing="4.8">THAT</text><text x="152" y="62" fontSize="10" letterSpacing="2.1">MATTER</text></g>
      </g>
    </svg>
    <span>ATM CONTENT STUDIO</span>
  </a>;
}
