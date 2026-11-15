import React from 'react';
import Nav from './Nav';
import Footer from './Footer';

export default function ProgramLayout({ children, hideBookingBadge = false }) {
  return (
    <div id="page-top">
      <Nav />
      {children}
      <Footer hideBookingBadge={hideBookingBadge} />
    </div>
  );
}
