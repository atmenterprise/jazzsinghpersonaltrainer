// SpecialistAreas.tsx with animated icons from original Jekyll repository
export default function SpecialistAreas() {
  const specialties = [
    {
      title: "Sustainable Weight Loss",
      icon: (
        <img
          src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/icons/balance.gif"
          alt="Balance"
          className="h-7 w-7 object-contain shrink-0 invert brightness-[2]"
          referrerPolicy="no-referrer"
        />
      ),
      description: "Step-by-step fat loss strategies focusing on calorie control without leaving behind your absolute favorite foods, enabling long-term habit formation.",
      badge: "Fat Loss"
    },
    {
      title: "Strength Training & Body Toning",
      icon: (
        <img
          src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/icons/deadlift.gif"
          alt="Deadlift"
          className="h-7 w-7 object-contain shrink-0 invert brightness-[2]"
          referrerPolicy="no-referrer"
        />
      ),
      description: "Custom-designed resistance templates to build muscular strength, sculpt posture, and define physical tone safely under professional form coaching.",
      badge: "Strength"
    },
    {
      title: "Lowering Blood Sugar, Cholesterol & Blood Pressure",
      icon: (
        <img
          src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/icons/muscle.gif"
          alt="Muscle"
          className="h-7 w-7 object-contain shrink-0 invert brightness-[2]"
          referrerPolicy="no-referrer"
        />
      ),
      description: "Focused program integrations designed specifically to shift biomarkers of hypertension, pre-diabetes, and hypercholesterolemia back into healthy reference ranges.",
      badge: "Vitality"
    },
    {
      title: "Advanced Nutrition & Sports Nutrition",
      icon: (
        <img
          src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/icons/exercise-routine.gif"
          alt="Routine"
          className="h-7 w-7 object-contain shrink-0 invert brightness-[2]"
          referrerPolicy="no-referrer"
        />
      ),
      description: "Precision sports nutrition to fuel active workouts, accelerate post-exercise recovery, and balance essential macronutrients dynamically.",
      badge: "Nutrition"
    },
    {
      title: "Personalised Nutrition Plans & Training Programmes",
      icon: (
        <img
          src="https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/icons/treadmill.gif"
          alt="Treadmill"
          className="h-7 w-7 object-contain shrink-0 invert brightness-[2]"
          referrerPolicy="no-referrer"
        />
      ),
      description: "Rigorous training splits and progressive nutritional roadmaps matching your distinct metabolism, starting point, and day-to-day lifestyle constraints.",
      badge: "Customization"
    }
  ];

  return (
    <section id="specialties" className="py-24 relative grid-overlay bg-black border-t border-zinc-900">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-bold block mb-2">
            Elite Expertise
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4 uppercase">
            Specialist Areas
          </h2>
          <hr className="w-16 h-1 bg-amber-500 border-none mx-auto mb-6" />
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            I specialize in unlocking maximum metabolic efficiency and physical strength while building clean, sustainable health profiles.
          </p>
        </div>

        {/* Beautiful Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((spec, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-none bg-zinc-950/80 border border-zinc-900 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="bg-amber-500/10 p-3 rounded-none border border-amber-500/10 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                    {spec.icon}
                  </div>
                  <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-zinc-400 bg-black px-3 py-1 rounded-none border border-zinc-900">
                    {spec.badge}
                  </span>
                </div>

                <h3 className="text-lg font-display font-bold text-white group-hover:text-amber-500 transition-colors duration-200 mb-3 uppercase tracking-tight">
                  {spec.title}
                </h3>
                
                <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                  {spec.description}
                </p>
              </div>

              {/* Card Footer with hover line decoration */}
              <div className="w-full bg-zinc-900 h-0.5 mt-2">
                <div className="bg-amber-500 w-0 group-hover:w-full h-full transition-all duration-500" />
              </div>
            </div>
          ))}

          {/* Quick Action Bento Panel */}
          <div className="md:col-span-2 lg:col-span-1 p-8 rounded-none bg-zinc-950 border border-amber-500/25 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.05] -z-10 group-hover:scale-105 transition-transform duration-700"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80')`,
              }}
            />
            
            <div>
              <div className="text-amber-500 font-mono text-[10px] uppercase tracking-widest font-bold mb-3">
                Action-Oriented
              </div>
              <h3 className="text-2xl font-display font-black text-white tracking-tight mb-4 uppercase leading-none">
                Ready to make a change?
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                Achieve your milestones faster by booking a consultation with direct, personal accountability. Let’s plan your routine together!
              </p>
            </div>

            <a
              href="#book"
              className="w-full bg-amber-500 hover:bg-white hover:text-black text-black font-display font-black uppercase text-xs tracking-widest py-4 px-4 rounded-none text-center transition-all duration-200"
            >
              Reach your goal today »
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
