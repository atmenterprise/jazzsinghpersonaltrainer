import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import SpecialistAreas from "./components/SpecialistAreas";
import ProgramDetails from "./components/ProgramDetails";
import Shop from "./components/Shop";
import Testimonials from "./components/Testimonials";
import Booking from "./components/Booking";
import Contact from "./components/Contact";
import LegalModal from "./components/LegalModal";
import { Dumbbell, ArrowUp } from "lucide-react";

export default function App() {
  const [legalModalType, setLegalModalType] = useState<"privacy" | "disclaimer" | "faq" | null>(null);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative selection:bg-amber-500 selection:text-black">
      
      {/* Decorative background gradients */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-zinc-950/40 to-transparent pointer-events-none -z-10" />

      {/* Sticky Top Navbar */}
      <Navbar
        onDisclaimerClick={() => setLegalModalType("disclaimer")}
        onPrivacyClick={() => setLegalModalType("privacy")}
        onFaqClick={() => setLegalModalType("faq")}
      />

      {/* Main Content Sections */}
      <main className="grow">
        <Hero />
        <About />
        <SpecialistAreas />
        <ProgramDetails />
        <Shop />
        <Testimonials />
        <Booking />
        <Contact />
      </main>

      {/* Elite Athlete Brand footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 py-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-[0.05] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-zinc-900">
            {/* Left Brand block */}
            <div className="flex items-center space-x-3 text-center md:text-left">
              <img
                src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/logo/jazboom.png"
                alt="Jaz BooM Logo"
                className="h-9 w-auto object-contain shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <span className="text-base font-display font-black text-white tracking-tight uppercase">
                  Jaz <span className="text-amber-500 font-extrabold">BooM</span>
                </span>
                <span className="text-[8px] uppercase font-mono tracking-widest text-zinc-500 block">
                  Nutritionist &amp; Personal Training
                </span>
              </div>
            </div>

            {/* Middle Quick Links block */}
            <div className="flex flex-wrap justify-center gap-6 text-[11px] font-display font-bold uppercase tracking-widest text-zinc-400">
              <a href="#about" className="hover:text-amber-500 transition-colors">About</a>
              <a href="#specialties" className="hover:text-amber-500 transition-colors">Specialties</a>
              <a href="#programmes" className="hover:text-amber-500 transition-colors">Programmes</a>
              <a href="#results" className="hover:text-amber-500 transition-colors">Testimonials</a>
              <button onClick={() => setLegalModalType("faq")} className="hover:text-amber-500 uppercase tracking-widest cursor-pointer">FAQs</button>
              <a href="#contact" className="hover:text-amber-500 transition-colors">Contact</a>
            </div>

            {/* Scroll back to top */}
            <button
              onClick={handleScrollToTop}
              className="p-3 bg-zinc-900 border border-zinc-800 rounded-none hover:bg-white hover:text-black text-zinc-400 transition-all shadow-md group"
              title="Back to Top"
            >
              <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-center sm:text-left">
            <div className="space-y-1">
              <p className="text-[10px] font-mono tracking-wider uppercase text-zinc-500">
                © {new Date().getFullYear()} Jaz BooM Personal Training. All rights reserved.
              </p>
              <p className="text-[8px] sm:text-[9px] font-mono tracking-[0.15em] uppercase text-zinc-600">
                WBESITE DESIGNED BY{" "}
                <a
                  href="https://linktr.ee/atmenterprise"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-500/80 hover:text-amber-500 transition-colors duration-200 font-bold hover:underline"
                >
                  ATM ENTERPRISE
                </a>
              </p>
            </div>
            
            {/* Privacy Links */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-x-6 gap-y-2 text-[10px] font-mono tracking-wider uppercase text-zinc-500">
              <button
                onClick={() => setLegalModalType("faq")}
                className="hover:text-amber-500 cursor-pointer hover:underline text-justify"
              >
                FAQs
              </button>
              <button
                onClick={() => setLegalModalType("disclaimer")}
                className="hover:text-amber-500 cursor-pointer hover:underline text-justify"
              >
                Disclaimer
              </button>
              <button
                onClick={() => setLegalModalType("privacy")}
                className="hover:text-amber-500 cursor-pointer hover:underline text-justify"
              >
                Privacy Policy &amp; GDPR
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Popups Legal Overlays (Conditional) */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
      />

    </div>
  );
}
