import { MapPin, Phone, Mail, MessageSquare, Facebook, Instagram, ClipboardCheck, ArrowUpRight } from "lucide-react";

export default function Contact() {
  const socialLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: "https://www.facebook.com/JazBooMPT",
      color: "hover:bg-amber-500 hover:text-black"
    },
    {
      name: "Instagram",
      icon: <Instagram className="h-5 w-5" />,
      url: "https://www.instagram.com/jaz_boom_pt/",
      color: "hover:bg-amber-500 hover:text-black"
    },
    {
      name: "WhatsApp Chat",
      icon: <MessageSquare className="h-5 w-5" />,
      url: "https://wa.me/447415547566?text=Hi%20Jaz",
      color: "hover:bg-amber-500 hover:text-black"
    }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-black border-t border-zinc-900">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-bold block mb-2">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4 uppercase">
            Contact
          </h2>
          <hr className="w-16 h-1 bg-amber-500 border-none mx-auto mb-6" />
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Have any questions or need custom arrangements? Speak directly with Jaz via email, telephone, or socials.
          </p>
        </div>

        {/* Contact layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Block: Communication avenues */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-lg font-display font-black text-white mb-6 uppercase tracking-wider border-b border-zinc-900 pb-2">
              Connect Channels
            </h3>

            <div className="space-y-4 font-sans">
              
              {/* Telephone card */}
              <a
                href="tel:+447415547566"
                className="flex items-center space-x-4 p-5 rounded-none bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all group animate-slideIn"
              >
                <div className="bg-amber-500/10 p-3.5 rounded-none text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500">Telephone</div>
                  <div className="text-white font-display font-bold text-sm mt-0.5 group-hover:text-amber-400 transition-colors">
                    +44 (0) 7415 547566
                  </div>
                </div>
              </a>

              {/* Email card */}
              <a
                href="mailto:jaz_personaltraining@yahoo.co.uk"
                className="flex items-center space-x-4 p-5 rounded-none bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all group animate-slideIn"
              >
                <div className="bg-amber-500/10 p-3.5 rounded-none text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500">Email Address</div>
                  <div className="text-white font-display font-bold text-sm mt-0.5 group-hover:text-amber-400 transition-colors truncate max-w-[210px] sm:max-w-none">
                    jaz_personaltraining@yahoo.co.uk
                  </div>
                </div>
              </a>

              {/* Physical Location Card */}
              <a
                href="https://goo.gl/maps/LWHsbBC1DGUCpS7x6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-4 p-5 rounded-none bg-zinc-950 border border-zinc-900 hover:border-zinc-800 transition-all group animate-slideIn"
              >
                <div className="bg-amber-500/10 p-3.5 rounded-none text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors shrink-0 font-sans">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-amber-500">Address Location</div>
                  <div className="text-zinc-400 text-xs mt-0.5 leading-relaxed group-hover:text-white transition-colors">
                    The Gym Group Pioneer Point, <br />
                    3-5 Winston Way, Ilford, IG1 2ZG, Essex, UK
                  </div>
                </div>
              </a>

            </div>

            {/* Social media connections */}
            <div className="pt-6">
              <h4 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-4">
                Follow me on social media
              </h4>
              <div className="flex space-x-3">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3.5 rounded-none bg-zinc-950 text-zinc-400 border border-zinc-900 transition-colors ${item.color}`}
                    title={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Block: Embedded visual Map Guidance */}
          <div className="lg:col-span-7 space-y-6 w-full h-[380px] lg:h-[460px] rounded-none overflow-hidden border border-zinc-900 relative group">
            <div className="absolute inset-0 bg-black/20 z-10 transition-opacity group-hover:opacity-0 pointer-events-none" />
            
            {/* High-fidelity OpenStreetMap or static view representation */}
            <iframe
              title="Gym Location Gym Group Ilford"
              src="https://maps.google.com/maps?q=The%20Gym%20Group%20Pioneer%20Point%20Ilford&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 grayscale-[50%] contrast-[110%] group-hover:grayscale-0 transition-all duration-500"
              allowFullScreen={false}
              loading="lazy"
            />

            {/* Float Floating Action Badge */}
            <div className="absolute bottom-6 right-6 z-20">
              <a
                href="https://www.thegymgroup.com/find-a-gym/east-london-gyms/london-ilford-pioneer-point/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-black/90 backdrop-blur-md border border-zinc-800 px-4 py-2.5 rounded-none text-[10px] uppercase font-mono tracking-wider text-white flex items-center space-x-2 shadow-lg hover:border-zinc-700"
              >
                <span>View Gym Website</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
