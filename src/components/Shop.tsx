import { ShoppingBag, ArrowUpRight, CheckCircle2, ShoppingCart } from "lucide-react";

export default function Shop() {
  return (
    <section id="shop" className="py-24 relative overflow-hidden bg-black border-t border-zinc-900">
      {/* Light accent spotlights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Container with premium visual layout */}
        <div className="relative rounded-none overflow-hidden border border-zinc-900 bg-zinc-950 p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Aesthetic Background Grid pattern overlay inside panel */}
          <div className="absolute inset-0 grid-overlay opacity-[0.2] pointer-events-none" />
          
          {/* Main Copywriting */}
          <div className="lg:w-1/2 relative z-10">
            <span className="inline-flex items-center space-x-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-mono font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-none mb-6">
              <ShoppingBag className="h-3 w-3" />
              <span>Nutritionist Recommendation</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4 uppercase">
              Get <span className="text-amber-500 font-extrabold italic">22% Off</span> <br />
              Reflex Nutrition
            </h2>
            
            <p className="text-amber-500 text-xs font-mono tracking-widest uppercase font-bold mb-6">
              Partner Affiliate Special Deal
            </p>

            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 text-justify">
              Fuel your physical training with elite quality supplementation. Reflex Nutrition has been standing at the absolute forefront of Sports Nutrition for over 25 years, manufacturing premium, science-backed formulas right here in the UK.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center space-x-3 text-zinc-400 text-sm">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Contact me to provide you with referral code</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-400 text-sm">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Highest-grade, micro-filtered protein powders</span>
              </li>
              <li className="flex items-center space-x-3 text-zinc-400 text-sm">
                <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0" />
                <span>Completely clean ingredients, batch tested for purity</span>
              </li>
            </ul>

            <a
              href="https://bit.ly/3Ay9c7O"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto bg-amber-500 hover:bg-white hover:text-black text-black font-display font-black uppercase text-xs tracking-widest px-8 py-5 rounded-none transition-colors duration-200 inline-flex items-center justify-center space-x-3 group"
            >
              <span>Shop Now</span>
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          {/* Creative Imagery representation of Sports Nutrition product */}
          <div className="lg:w-1/2 relative w-full aspect-video sm:aspect-square lg:aspect-[4/3] rounded-none overflow-hidden border border-zinc-900">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img
              src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/shop/reflex.jpg"
              alt="Reflex Nutrition Supplementation bottles"
              className="w-full h-full object-top hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay Banner Card */}
            <div className="absolute top-6 right-6 z-20 bg-black/90 backdrop-blur-md border border-zinc-800 p-4 rounded-none">
              <div className="flex items-center space-x-2 text-white">
                <ShoppingCart className="h-4 w-4 text-amber-500" />
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase">Official affiliate code</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
