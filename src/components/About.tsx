import { motion } from "motion/react";
import { Award, ShieldAlert, Heart, Calendar } from "lucide-react";

export default function About() {
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950 border-t border-zinc-900">
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-80 h-80 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Premium Trainer Portrayal / Visual Assets */}
          <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
            <div className="relative rounded-none overflow-hidden shadow-2xl border border-zinc-900 aspect-[4/5] w-full">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none" />
              <img
                src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/profile/profile.jpg"
                alt="Jaz Boom Personal Trainer and Nutritionist"
                className="w-full h-full object-cover object-top scale-105 hover:scale-100 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlay Stat Card */}
              <div className="absolute bottom-6 left-6 right-6 z-20 p-5 bg-zinc-950 border border-zinc-800 rounded-none backdrop-blur-md">
                <div className="text-amber-500 font-display font-black uppercase tracking-wider text-base mb-1">Jaz Singh</div>
                <p className="text-xs text-zinc-400 leading-relaxed font-mono">
                  Personal Trainer (PT) &amp; Nutritionist with 15+ years of active fitness experience.
                </p>
              </div>
            </div>

            {/* Glowing Accent Frame */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/10 to-transparent -z-10 blur-xl opacity-50" />
          </div>

          {/* Right Column: Bio Copywriting */}
          <div className="lg:col-span-7 col-span-1">
            <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-bold block mb-2">
              My Personal Journey
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-8 uppercase">
              About Me
            </h2>

            <div className="space-y-6 text-zinc-300 text-base sm:text-lg leading-relaxed">
              <p className="font-extrabold text-white text-lg sm:text-xl border-l-4 border-amber-500 pl-4 py-1 leading-snug">
                Hi, I’m Jaz — a Nutritionist and Personal Trainer (PT) with over 15 years of experience in the health &amp; fitness industry.
              </p>

              <p className="text-justify text-zinc-400 text-sm sm:text-base">
                In 2004, I was diagnosed with a rare autoimmune condition that left me wheelchair-bound, requiring multiple surgeries and facing the possibility of never having children. I took my health into my own hands and refused to accept that outcome. Today, I am a father of three, walking, training, and living proof that the body is capable of more than a diagnosis suggests.
              </p>

              <p className="text-justify text-zinc-400 text-sm sm:text-base">
                I continue to manage this condition and epilepsy through exercise, nutrition, and deliberate daily lifestyle choices. That experience is not merely my backstory; it is the foundation of my work and the reason I understand the challenges of maintaining fitness and nutrition when facing health obstacles.
              </p>

              <p className="text-justify text-zinc-400 text-sm sm:text-base">
                I am Jaz, a nutritionist and personal trainer with over 15 years of experience. I specialise in sustainable fat loss and helping individuals manage chronic conditions such as high blood pressure, cholesterol, and blood sugar to regain control of their health through targeted training and nutrition.
              </p>

              <p className="text-justify text-zinc-400 text-sm sm:text-base">
                I have worked with many clients who sought my guidance after their GP indicated that their health markers were trending in the wrong direction. For clients who have previously struggled to maintain gym routines or experienced weight regain, I offer a bespoke plan tailored to your lifestyle, health history, and goals.
              </p>

              <p className="text-justify text-zinc-400 text-sm sm:text-base">
                As a former Expert Patient Programme Tutor, I have extensive experience teaching individuals with long-term conditions to manage symptoms through lifestyle changes, bridging the gap between medical needs and fitness.
              </p>

              <p className="text-zinc-500 text-xs sm:text-sm italic border-t border-zinc-900 pt-4">
                Every client I have worked with has successfully lost weight, improved health markers, built strength, or achieved all three. Your results begin with a free consultation. Get in touch.
              </p>
            </div>

            {/* Highlights blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex space-x-3 p-4 bg-zinc-950/60 rounded-none border border-zinc-900">
                <Heart className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wide">Empathetic Coaching</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Real experience managing auto-immune symptoms &amp; epilepsy with lifestyle modifications.</p>
                </div>
              </div>
              <div className="flex space-x-3 p-4 bg-zinc-950/60 rounded-none border border-zinc-900">
                <Award className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm uppercase tracking-wide">Chronic Health Support</h4>
                  <p className="text-xs text-zinc-500 mt-1 leading-relaxed">Volunteer Tutor for long-term clinical conditions; blood pressure, sugar, cholesterol.</p>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <a
                href="#book"
                className="inline-flex items-center space-x-3 bg-amber-500 hover:bg-white text-black font-display font-black uppercase text-xs tracking-widest px-8 py-4 px-6 py-4.5 rounded-none transition-all duration-200"
              >
                <span>Find Out More &amp; Book Today</span>
                <Calendar className="h-3.5 w-3.5" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
