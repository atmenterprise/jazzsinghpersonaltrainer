import React from 'react';
import Nav from './Nav';
import FAQ from './FAQ';
import Footer from './Footer';

export default function ProgramLayout({ children, showFaq = true }) {
  return (
    <div id="page-top">
      <Nav />
      {children}
      {showFaq && <FAQ />}
      <Footer />
    </div>
  );
}
