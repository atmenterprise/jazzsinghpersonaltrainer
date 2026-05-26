import { motion } from "motion/react";
import { ArrowRight, Trophy, Zap, ShieldAlert, Calendar } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden pt-32 pb-20 grid-overlay bg-black">
      {/* Visual background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black z-10" />
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.25]"
        style={{
          backgroundImage: `url('https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/header.jpg')`,
        }}
      />

      {/* Radial ambient glow lights */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-[130px] pointer-events-none" />

      {/* Styled Background Branding Lettering from Theme */}
      <div className="absolute -bottom-12 -left-16 text-[14rem] sm:text-[20rem] md:text-[24rem] font-black text-zinc-900/15 select-none leading-none pointer-events-none tracking-tighter">
        BOOM
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center lg:text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Call to Actions */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Top welcome tag with premium brand indicators */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-3 bg-zinc-900/85 border border-zinc-800/80 px-4 py-2 mb-8 backdrop-blur-sm"
            >
              <div className="h-[1px] w-8 bg-amber-500"></div>
              <span className="text-[10px] font-bold tracking-[0.3em] text-amber-500 font-sans uppercase">
                Personal Training & Nutritionist
              </span>
            </motion.div>

            {/* Main Display Title */}
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-display font-extrabold text-white tracking-tight leading-[1.05] mb-6 uppercase"
            >
              Welcome to <br />
              <span className="text-amber-500 font-black relative inline-block italic">Jaz BooM</span> <br />
              Personal Training
            </motion.h1>

            {/* Subtitle - human, clean, legible */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-400 font-medium max-w-2xl lg:max-w-none leading-relaxed mb-10"
            >
              Reach Your Health &amp; Fitness goals with <strong className="text-white font-bold">Jaz BooM</strong>. Unlock peak physical performance with bespoke protocols in strength, clinical wellness, and elite nutrition.
            </motion.p>

            {/* Action Buttons - Sharp Corners with hover transitions */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 w-full sm:w-auto"
            >
              <a
                href="#book"
                className="w-full sm:w-auto bg-amber-500 hover:bg-white text-black font-display font-black uppercase text-xs tracking-widest px-8 py-5 rounded-none transition-colors duration-200 flex items-center justify-center space-x-3 group shadow-xl shadow-amber-500/10"
              >
                <span>Book Guest Consultation</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="#about"
                className="w-full sm:w-auto bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-800 text-white font-display font-bold uppercase text-xs tracking-widest px-8 py-5 rounded-none transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>Read My Story</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column: Beautiful Introductory Image Block */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none relative aspect-[4/5] overflow-visible"
          >
            {/* Background Majestic Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-amber-600/10 rounded-none blur-2xl opacity-40 mix-blend-screen pointer-events-none" />

            {/* Image Frame Wrapper */}
            <div className="relative w-full h-full overflow-hidden border border-zinc-900 shadow-2xl group">
              {/* Outer pure decorative frame corner lines for the premium athletic aesthetic */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-500 z-30 pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-500 z-30 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-500 z-30 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-500 z-30 pointer-events-none" />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent z-10" />

              <img
                src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/header.jpg"
                alt="Jaz BooM Personal Trainer Action Shot"
                className="w-full h-full object-cover object-center scale-102 hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Floating Badge over the image */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/90 backdrop-blur-md border border-zinc-800/80 p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">Action Protocol</div>
                  <div className="text-white font-display text-sm font-bold mt-0.5">High-Performance Training</div>
                </div>
                <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
            </div>
          </motion.div>

        </div>

        {/* Stat/trust signals blocks updated to crisp industrial borders */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20 relative z-20"
        >
          <div className="flex items-center space-x-4 p-6 bg-zinc-950/80 backdrop-blur-md border-l-4 border-amber-500 border-y border-r border-zinc-900 text-left">
            <div className="bg-amber-500/10 p-2.5 rounded-none border border-amber-500/10 text-amber-500">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <div className="text-3xl font-display font-black text-white">10+ Years</div>
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Industry Experience</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 bg-zinc-950/80 backdrop-blur-md border-l-4 border-amber-500 border-y border-r border-zinc-900 text-left">
            <div className="bg-amber-500/10 p-2.5 rounded-none border border-amber-500/10 text-amber-500">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-3xl font-display font-black text-white">15kg+ Loss</div>
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Average Client Results</div>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-6 bg-zinc-950/80 backdrop-blur-md border-l-4 border-amber-500 border-y border-r border-zinc-900 text-left">
            <div className="bg-amber-500/10 p-2.5 rounded-none border border-amber-500/10 text-amber-500">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <div className="text-3xl font-display font-black text-white">Specialist</div>
              <div className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Clinical &amp; Autoimmune PT</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
