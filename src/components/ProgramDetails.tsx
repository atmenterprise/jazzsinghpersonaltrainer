import { useState } from "react";
import { CheckCircle2, Target, Calendar, Award, Flame, Gem } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProgramDetail {
  id: string;
  name: string;
  tagline: string;
  image: string;
  duration: string;
  whosItFor: string[];
  whatsIncluded: string[];
  resultsExpect: string[];
  investment: string;
  investmentDetails: string[];
}

export default function ProgramDetails() {
  const [activeTab, setActiveTab] = useState<string>("onetoonept");

  const programDetails: Record<string, ProgramDetail> = {
    onetoonept: {
      id: "onetoonept",
      name: "1:1 Personal Training",
      tagline: "Reach your goals faster under personal professional direct care.",
      //image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
      image: "https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/programs/1.jpg",
      duration: "60 Minute Sessions",
      whosItFor: [
        "Great for anyone who would like to follow a personalised programme to reach their health and fitness related goal faster.",
        "Unsure where to begin or have tried many times before and stopped seeing results in what they set out to achieve.",
        "Benefit from having someone to be accountable to, learning the correct techniques for exercises, and understanding nutrition and how to apply it."
      ],
      whatsIncluded: [
        "Receive a personalised nutrition plan while trying to keep your lifestyle in mind, increasing your nutrition knowledge and promoting healthy eating habits.",
        "Nutrition plan adjustments essential as progress slows down the more body fat you drop.",
        "Training plan designed relative to your goal and starting place to help you gain confidence and experience in the gym while boosting activity outside.",
        "Training plan adjustments for continued progress by breaking plateaus.",
        "Regular tracking and reviews of progress with feedback and actions for weeks ahead.",
        "Photos, scales, and how you feel will be used to measure progress."
      ],
      resultsExpect: [
        "If you commit 100% by working hard, staying consistent, and acting on feedback, you will achieve results whatever your age, ability or starting point.",
        "Improvements across the board in weight, body fat, body tone, posture, physical strength, fitness, and performance.",
        "Feel distinct improvements in sleep quality, mood, stress management, digestion, confidence, and daily energy."
      ],
      investment: "Ultimate Guided accountability for fast, targeted results.",
      investmentDetails: [
        "Have a real return on your investment because I’m invested in you achieving your goal.",
        "Receive help over every hurdle while gaining the knowledge of how to avoid them in the future.",
        "Sessions will be 60 minutes long in which I will show you how to safely use a variety of gym equipment, reducing your dependency in the gym.",
        "Structure includes a framework of accountability to keep you fully on track with options to extend your program."
      ]
    },
    couplept: {
      id: "couplept",
      name: "2:1 Personal Training",
      tagline: "Split the cost, double the motivation with partner accountability.",
      //image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=1200&q=80",
      image: "https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/programs/2.jpg",
      duration: "60 Minute Sessions (Shared)",
      whosItFor: [
        "If you have a common health and fitness related goal and can workout at the same time, this is a great way to share the experience and achieve your goals faster.",
        "Whether you both have the same experience in the gym or not, you'll still be individually supported to reach your respective goals as you train together.",
        "Less likely to quit the process early or put less effort into your workouts as there will be a little friendly competition to each session."
      ],
      whatsIncluded: [
        "Receive a personalised nutrition plan while trying to keep your lifestyle in mind, increasing your nutrition knowledge and promoting healthy eating habits.",
        "Nutrition plan adjustments essential as progress slows down the more bodyfat you drop.",
        "Training plan designed relative to your goal and starting place to help you gain confidence and experience in the gym while boosting activity outside.",
        "Training plan adjustments for continued progress by breaking plateaus.",
        "Regular tracking and reviews of progress with feedback and actions for weeks ahead.",
        "Photos, scales, and how you feel will be used to measure progress."
      ],
      resultsExpect: [
        "If you are both willing to commit 100% to the process by working hard, staying consistent, remaining patient, and applying feedback, then you will achieve results.",
        "Improvements across the board in weight, body fat, body tone, posture, physical strength, fitness, and performance.",
        "Feel the difference in measures such as mood, stress, sleep, digestion, confidence, and energy."
      ],
      investment: "Split payments, minimize individual cost, share the return.",
      investmentDetails: [
        "Minimise the cost by splitting the payments between yourselves and have a real return on your investment because I’m invested in you achieving your goals.",
        "Receive help over every hurdle and gain the knowledge of how to avoid them in future.",
        "Sessions are 60 minutes long, focusing on how both of you can safely make the most of the gym while boosting group momentum.",
        "Option to extend your results-driven shared program."
      ]
    },
    onlinept: {
      id: "onlinept",
      name: "Online Coaching",
      tagline: "Full coaching guidance with total remote flexibility from anywhere.",
      //image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
      image: "https://raw.githubusercontent.com/atmenterprise/jazzsinghpersonaltrainer/main/img/programs/3.jpg",
      duration: "Flexible Scheduling",
      whosItFor: [
        "Great for individuals who are happy following a personalised programme with more flexibility when they train.",
        "For clients who want professional support, guidance, and high accountability to reach their health and fitness related goals faster."
      ],
      whatsIncluded: [
        "Receive a personalised nutrition plan while trying to keep your lifestyle in mind, increasing your nutrition knowledge and promoting healthy eating habits.",
        "Nutrition plan adjustments essential as your progress will slow down the more bodyfat reference you drop.",
        "Training plan designed relative to your goal and starting place to help you gain confidence and experience in the gym while boosting activity outside.",
        "Training plan adjustments for continued progress by breaking plateaus.",
        "Regular tracking and reviews of progress to hold you accountable with feedback through 20 minutes phone or video call check-ins including actions for weeks ahead.",
        "Photos, scales, and feedback from your check-ins will be used to measure progress."
      ],
      resultsExpect: [
        "If you commit 100% by working hard, staying consistent, remaining patient, and acting on feedback, you will achieve results whatever your starting point.",
        "Systematic delivery of improvements in weight, body fat, body tone, posture, and physical strength.",
        "Noticeable positive changes in daily stress, posture, digestive routine, and mindset confidence."
      ],
      investment: "Professional programming at a lower entry-barrier price.",
      investmentDetails: [
        "Have a real return on your investment because I’m invested in you achieving your goal.",
        "Receive help over every hurdle while gaining the knowledge of how to avoid them in future.",
        "Benefit with a robust structured network of accountability to keep you on track throughout the weeks, with options to extend."
      ]
    },
    nutritionpt: {
      id: "nutritionpt",
      name: "Health Check",
      tagline: "Target high blood pressure, blood sugar plateaus, and nutrition symptoms.",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
      duration: "Custom health profile review",
      whosItFor: [
        "Perfect for someone who would like to lower their high blood sugar, cholesterol, blood pressure.",
        "Perfect for someone who has hit a plateau in their training and weight loss goals.",
        "Find out exactly what you could be doing additionally to achieve your health and fitness goals faster."
      ],
      whatsIncluded: [
        "Identify if you’re at risk of becoming someone with high blood sugar, high cholesterol, and high blood pressure.",
        "Knowing what lifestyle changes will help with the above health issues and your Weight loss goal.",
        "Steps to help you break your plateau in your training and Weight loss goal.",
        "Detailed profile analysis and information on what vitamins you could benefit from."
      ],
      resultsExpect: [
        "Clearly understand the specific habits or underlying nutritional gaps that are stalling your physical momentum.",
        "Concrete lifestyle guidance to start shifting your reference metrics (blood sugar, pressure) in the first weeks."
      ],
      investment: "A powerful, targeted assessment for immediate course correction.",
      investmentDetails: [
        "Complete structural analysis of lifestyle metrics to highlight what symptoms are holding you back.",
        "No guessing: clear actions to start managing your long-term health positively, right from today.",
        "Find out more by scheduling a complimentary call to begin your assessment plan."
      ]
    }
  };

  const programKeys = Object.keys(programDetails);
  const activeProgram = programDetails[activeTab];

  return (
    <section id="programmes" className="py-24 relative bg-slate-950 border-t border-zinc-900">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-bold block mb-2">
            Training &amp; Coaching
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4 uppercase">
            Our Programmes
          </h2>
          <hr className="w-16 h-1 bg-amber-500 border-none mx-auto mb-6" />
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Choose a premium program built strictly around your specific health, body, and lifestyle objectives.
          </p>
        </div>

        {/* Dynamic Desktop Selector Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 max-w-4xl mx-auto">
          {programKeys.map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3.5 py-2.5 sm:px-5 sm:py-3.5 rounded-none font-display font-black text-[10px] sm:text-xs tracking-widest transition-all uppercase ${
                activeTab === key
                  ? "bg-amber-500 text-black shadow-lg shadow-amber-500/10"
                  : "bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-900"
              }`}
            >
              {programDetails[key].name}
            </button>
          ))}
        </div>

        {/* Detailed Container Viewer with Animations */}
        <div className="glass-panel rounded-none p-6 sm:p-10 border border-zinc-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12"
            >
              
              {/* Left detail card section */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div>
                  <div className="relative rounded-none overflow-hidden aspect-video lg:aspect-[4/3] mb-6 border border-zinc-900">
                    <img
                      src={activeProgram.image}
                      alt={activeProgram.name}
                      className="w-full h-full object-top grayscale-[30%] hover:grayscale-0 transition-all duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-md border border-zinc-800 text-amber-500 font-mono text-[9px] uppercase font-bold px-3 py-1.5 rounded-none">
                      {activeProgram.duration}
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-display font-black text-white mb-2 leading-tight uppercase">
                    {activeProgram.name}
                  </h3>
                  <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-6">
                    {activeProgram.tagline}
                  </p>
                </div>

                <div className="bg-zinc-950 rounded-none p-5 border border-zinc-900 mt-auto">
                  <div className="flex items-center space-x-2 text-white font-bold text-xs uppercase tracking-wider mb-2">
                    <Gem className="h-4 w-4 text-amber-500" />
                    <span>Your Investment</span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {activeProgram.investment}
                  </p>
                </div>
              </div>

              {/* Right lists details sections (3 main sub-sections) */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                <div className="space-y-8">
                  {/* WHO'S IT FOR */}
                  <div>
                    <h4 className="flex items-center space-x-2 text-white font-display font-bold text-sm tracking-wider uppercase mb-4 border-b border-zinc-900 pb-2">
                      <Target className="h-4.5 w-4.5 text-amber-500" />
                      <span>WHO'S IT FOR?</span>
                    </h4>
                    <div className="space-y-3">
                      {activeProgram.whosItFor.map((p, idx) => (
                        <p key={idx} className="text-zinc-400 text-sm leading-relaxed text-justify">
                          {p}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* WHAT'S INCLUDED? */}
                  <div>
                    <h4 className="flex items-center space-x-2 text-white font-display font-bold text-sm tracking-wider uppercase mb-4 border-b border-zinc-900 pb-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-amber-500" />
                      <span>WHAT'S INCLUDED?</span>
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {activeProgram.whatsIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-sm text-zinc-400">
                          <span className="text-amber-500 font-mono text-xs mt-0.5 bg-amber-500/10 h-5 w-5 rounded-none flex items-center justify-center border border-amber-500/20 shrink-0">
                            ✓
                          </span>
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* THE RESULTS YOU CAN EXPECT */}
                  <div>
                    <h4 className="flex items-center space-x-2 text-white font-display font-bold text-sm tracking-wider uppercase mb-4 border-b border-zinc-900 pb-2">
                      <Award className="h-4.5 w-4.5 text-amber-500" />
                      <span>THE RESULTS YOU CAN EXPECT?</span>
                    </h4>
                    <div className="space-y-3">
                      {activeProgram.resultsExpect.map((r, idx) => (
                        <p key={idx} className="text-zinc-400 text-sm leading-relaxed text-justify">
                          {r}
                        </p>
                      ))}
                    </div>
                  </div>

                  {/* INVESTMENT DETAILS */}
                  {activeProgram.investmentDetails.length > 0 && (
                    <div>
                      <h4 className="flex items-center space-x-2 text-white font-display font-bold text-sm tracking-wider uppercase mb-4 border-b border-zinc-900 pb-2">
                        <Flame className="h-4.5 w-4.5 text-amber-500" />
                        <span>COMMITTED INVESTMENT BENEFITS</span>
                      </h4>
                      <div className="space-y-2.5">
                        {activeProgram.investmentDetails.map((det, idx) => (
                          <p key={idx} className="text-zinc-400 text-sm leading-relaxed text-justify">
                            {det}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub-CTA */}
                <div className="mt-8 pt-6 border-t border-zinc-900 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">
                    Custom structural tracking with slow &amp; steady progress.
                  </span>
                  <a
                    href="#book"
                    className="bg-amber-500 hover:bg-white hover:text-black text-black font-display font-black uppercase text-xs tracking-widest py-4 px-6 rounded-none text-center transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Book consultation call today</span>
                    <Calendar className="h-3.5 w-3.5" />
                  </a>
                </div>

              </div>

            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
