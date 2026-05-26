import { useState, useEffect } from "react";
import { Dumbbell, Menu, X, Calendar } from "lucide-react";

interface NavbarProps {
  onDisclaimerClick: () => void;
  onPrivacyClick: () => void;
  onFaqClick: () => void;
}

export default function Navbar({ onDisclaimerClick, onPrivacyClick, onFaqClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "About Me", href: "#about" },
    { label: "Specialties", href: "#specialties" },
    { label: "Programmes", href: "#programmes" },
    { label: "Reflex Shop", href: "#shop" },
    { label: "Results", href: "#results" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md shadow-lg border-b border-slate-900 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center space-x-2.5 group">
            <img
              src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/logo/jazboom.png"
              alt="Jaz BooM Logo"
              className="h-10 w-auto object-contain shrink-0 transition-transform group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-xl font-display font-black tracking-tighter text-white leading-none uppercase">
                Jaz <span className="text-amber-500 italic">BooM</span><span className="text-amber-500">.</span>
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-zinc-400 uppercase leading-none mt-1">
                Personal Training
              </span>
            </div>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6 text-[11px] font-bold uppercase tracking-widest">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-zinc-400 hover:text-white transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <a
              href="#book"
              className="bg-amber-500 hover:bg-white hover:text-black text-black font-display font-black uppercase text-xs tracking-widest px-6 py-3 rounded-none transition-colors duration-200 flex items-center space-x-2"
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>Free Consultation</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
              aria-expanded="false"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-zinc-900">
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3 text-center">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-3 text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900/40"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 px-3">
              <a
                href="#book"
                onClick={() => setIsOpen(false)}
                className="w-full bg-amber-500 hover:bg-white hover:text-black text-black font-display font-black uppercase text-xs tracking-widest py-4 px-4 rounded-none transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Book Free Consultation</span>
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-6 text-[10px] font-mono tracking-widest uppercase text-zinc-500">
              <button onClick={() => { setIsOpen(false); onFaqClick(); }} className="hover:text-white transition-colors cursor-pointer">FAQs</button>
              <button onClick={() => { setIsOpen(false); onDisclaimerClick(); }} className="hover:text-white transition-colors cursor-pointer">Disclaimer</button>
              <button onClick={() => { setIsOpen(false); onPrivacyClick(); }} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
