import { useEffect } from "react";
import { Calendar, PhoneCall, CheckSquare, Sparkles } from "lucide-react";

export default function Booking() {
  useEffect(() => {
    // Dynamically load the Calendly integration script on mount
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up on unmount
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <section id="book" className="py-24 relative overflow-hidden bg-black border-t border-zinc-900">
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-bold block mb-2">
            Schedule Appointment
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4 uppercase">
            Book Free Consultation
          </h2>
          <hr className="w-16 h-1 bg-amber-500 border-none mx-auto mb-6" />
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            A simple, secure process to enable you to book a complimentary 1:1 phone strategy call directly with Jaz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Wording & booking instructions card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-none border border-zinc-900 shadow-2xl">
              <h3 className="text-sm font-display font-black text-white mb-6 uppercase tracking-widest flex items-center space-x-2 border-b border-zinc-900 pb-3">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span>Booking Process</span>
              </h3>
              
              <div className="space-y-4 text-zinc-400 text-sm leading-relaxed">
                <p className="text-justify">
                  Select a suitable date and time for you from the available slots from the calendar.
                </p>
                <p className="text-justify border-l-2 border-amber-500 pl-4 py-1 text-zinc-500 font-medium">
                  During your 15 minute phone call appointment I will try to understand your goals and help you plan the next steps of your journey to reaching your goals.
                </p>
              </div>

              {/* Bullet checklist steps */}
              <div className="mt-8 space-y-5 border-t border-zinc-900 pt-6">
                <div className="flex items-start space-x-3 text-xs text-zinc-400">
                  <span className="flex items-center justify-center bg-amber-500/10 text-amber-500 h-6 w-6 rounded-none border border-amber-500/20 font-bold shrink-0 font-display">1</span>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider">Pick a Slot</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Choose a convenient time on the scheduling calendar.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-zinc-400">
                  <span className="flex items-center justify-center bg-amber-500/10 text-amber-500 h-6 w-6 rounded-none border border-amber-500/20 font-bold shrink-0 font-display">2</span>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider">Fill Contact Details</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">Provide a phone number for me to ring you directly.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 text-xs text-zinc-400">
                  <span className="flex items-center justify-center bg-amber-500/10 text-amber-500 h-6 w-6 rounded-none border border-amber-500/20 font-bold shrink-0 font-display">3</span>
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wider">15 Min Strategy Call</h4>
                    <p className="text-[11px] text-zinc-500 mt-0.5">We will map out your slow &amp; steady fitness plan.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support notes card */}
            <div className="bg-zinc-950 p-5 rounded-none border border-zinc-900 text-zinc-400 text-xs leading-relaxed">
              <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-white mb-2">
                <PhoneCall className="h-4 w-4 text-amber-500" />
                <span>Timeslots custom request</span>
              </div>
              <p>
                Send a quick Message or Whatsapp to <strong className="text-white">+44 (0) 7415 547566</strong> or email <strong className="text-white">jaz_personaltraining@yahoo.co.uk</strong> and we can schedule a custom offline slot!
              </p>
            </div>
          </div>

          {/* Right Column: Calendly integration */}
          <div className="lg:col-span-8 glass-panel rounded-none overflow-hidden border border-zinc-900 shadow-2xl bg-white/5 py-4 min-h-[700px]">
            {/* The standard Calendly Widget integration placeholder */}
            <div 
              className="calendly-inline-widget" 
              data-url="https://calendly.com/jaz_personaltraining/15min" 
              style={{ minWidth: "320px", height: "700px" }} 
            />
          </div>

        </div>

      </div>
    </section>
  );
}
