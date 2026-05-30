import { useState } from "react";
import { testimonials, TestimonialItem } from "../data/testimonials";
import { Instagram, Search, Award, RefreshCw, Quote, ArrowLeft, ArrowRight } from "lucide-react";

export default function Testimonials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [filterType, setFilterType] = useState<"featured" | "all">("featured");

  // Filter testimonials based on active state & search query
  const filteredTestimonials = testimonials.filter((item) => {
    const matchesSearch =
      item.testimonial.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.testimonial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.testimonial.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === "featured") {
      return item.featured && matchesSearch;
    }
    return matchesSearch;
  });

  const featuredList = testimonials.filter((item) => item.featured);

  const handleNextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % featuredList.length);
  };

  const handlePrevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + featuredList.length) % featuredList.length);
  };

  const currentFeatured = featuredList[activeSlide];

  return (
    <section id="results" className="py-24 relative overflow-hidden bg-black border-t border-zinc-900 grid-overlay">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header content */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono tracking-[0.25em] text-amber-500 uppercase font-bold block mb-2">
            Client Success
          </span>
          <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight mb-4 uppercase">
            The Results You Can Expect
          </h2>
          <hr className="w-16 h-1 bg-amber-500 border-none mx-auto mb-6" />
          <p className="text-zinc-400 text-sm sm:text-base max-w-2xl mx-auto">
            Read real-life testimonials from clients who committed 100% and achieved life-changing strength, weight, and clinical bio-marker improvements.
          </p>
        </div>

        {/* Featured Slider - Big visual accent quotes */}
        <div className="mb-20">
          <div className="relative glass-panel rounded-none p-6 sm:p-12 border border-zinc-900 max-w-4xl mx-auto shadow-2xl overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="absolute top-6 right-8 text-amber-500/10 pointer-events-none">
              <Quote className="h-28 w-28 stroke-[1.5]" />
            </div>

            <div className="relative z-10">
              <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-mono tracking-widest uppercase font-bold px-3 py-1 rounded-none mb-6 inline-block">
                Featured Success Story
              </span>

              <h3 className="text-xl sm:text-3xl font-display font-black text-white mb-6 leading-snug uppercase tracking-tight">
                "{currentFeatured?.testimonial.title}"
              </h3>

              <div className="text-zinc-330 text-sm sm:text-base leading-relaxed text-justify max-h-[220px] overflow-y-auto pr-2 mb-8 space-y-4 font-light scrollbar-thin scrollbar-thumb-zinc-800">
                {currentFeatured?.testimonial.description.split('\n').filter(Boolean).map((paragraph, index) => (
                  <p key={index} className="text-zinc-400">{paragraph}</p>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-zinc-900 pt-6 gap-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-none h-11 w-11 flex items-center justify-center font-display font-bold text-base">
                    {currentFeatured?.testimonial.author[0]}
                  </div>
                  <div>
                    <div className="text-white font-display font-extrabold text-sm uppercase">
                      {currentFeatured?.testimonial.author}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                      Verified Client
                    </div>
                  </div>
                </div>

                {currentFeatured?.testimonial.link && (
                  <a
                    href={currentFeatured.testimonial.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest text-amber-500 hover:text-white border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 rounded-none transition-all self-start sm:self-center"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                    <span>View original Instagram post</span>
                  </a>
                )}
              </div>
            </div>

            {/* Next/Prev buttons */}
            <div className="flex justify-end space-x-2 mt-8 md:absolute md:bottom-8 md:right-12 md:mt-0 z-20">
              <button
                onClick={handlePrevSlide}
                className="p-3.5 rounded-none bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Previous Success Story"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextSlide}
                className="p-3.5 rounded-none bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Next Success Story"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Interactive Filter and search block */}
        <div className="glass-panel rounded-none p-6 sm:p-8 border border-zinc-900 mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Toggle buttons */}
          <div className="flex space-x-2 shrink-0">
            <button
              onClick={() => {
                setFilterType("featured");
                setSearchQuery("");
              }}
              className={`px-4 py-3 rounded-none font-display font-black text-[10px] tracking-widest uppercase transition-all ${
                filterType === "featured"
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/10"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-900"
              }`}
            >
              Featured Highlights ({featuredList.length})
            </button>
            <button
              onClick={() => {
                setFilterType("all");
                setSearchQuery("");
              }}
              className={`px-4 py-3 rounded-none font-display font-black text-[10px] tracking-widest uppercase transition-all ${
                filterType === "all"
                  ? "bg-amber-500 text-black shadow-md shadow-amber-500/10"
                  : "bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-900"
              }`}
            >
              See All Reviews ({testimonials.length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by client or key condition (e.g. sugar, weight)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 text-zinc-300 font-sans text-xs tracking-wider pl-10 pr-4 py-3.5 rounded-none border border-zinc-900 focus:outline-none focus:border-amber-500/50"
            />
          </div>
        </div>

        {/* Testimonials List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTestimonials.map((item) => {
            const isRishu = item.testimonial.author.toLowerCase() === "rishu";
            return (
              <div
                key={item.id}
                className={`relative p-8 rounded-none bg-zinc-950/80 border transition-all duration-300 flex flex-col justify-between ${
                  isRishu
                    ? "border-amber-500/40 bg-gradient-to-br from-zinc-950 via-amber-500/5 to-zinc-950 shadow-xl shadow-amber-500/5"
                    : "border-zinc-900 hover:border-zinc-800"
                }`}
              >
                {/* Rishu testimonial glowing badge */}
                {isRishu && (
                  <div className="absolute -top-3 left-6 z-10 inline-flex items-center space-x-1.5 bg-amber-500 text-black font-mono text-[9px] uppercase font-bold px-3 py-1 rounded-none shadow-lg">
                    <Award className="h-3 w-3" />
                    <span>Client Highlight</span>
                  </div>
                )}

                <div>
                  <h4 className="text-base font-display font-bold text-white mb-3 uppercase tracking-tight">
                    "{item.testimonial.title}"
                  </h4>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6 whitespace-pre-line line-clamp-6 text-justify">
                    {item.testimonial.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-6">
                  <div className="flex items-center space-x-2.5">
                    <div className={`rounded-none h-8 w-8 flex items-center justify-center font-display font-black text-xs ${
                      isRishu ? "bg-amber-500 text-black" : "bg-zinc-900 text-amber-500"
                    }`}>
                      {item.testimonial.author[0]}
                    </div>
                    <div>
                      <div className="text-white font-extrabold text-xs inline-flex items-center gap-1 uppercase">
                        <span>{item.testimonial.author}</span>
                      </div>
                      <div className="text-[9px] font-mono tracking-wider uppercase text-zinc-500">Verified Client</div>
                    </div>
                  </div>

                  {item.testimonial.link && (
                    <a
                      href={item.testimonial.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="View original link"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {filteredTestimonials.length === 0 && (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 glass-panel rounded-none">
              <p className="text-zinc-400 text-sm">No client reviews match your query.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("all");
                }}
                className="text-amber-500 text-xs mt-3 flex items-center justify-center mx-auto space-x-1 hover:underline"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>

        {/* CTA Banner inside testimonials */}
        <div className="mt-16 text-center max-w-xl mx-auto p-8 rounded-none bg-zinc-950 border border-zinc-900">
          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mb-4">
            Want to start your own transformation? Hear from Jaz on a detailed consultation call. Let's build your slow and steady roadmap safely.
          </p>
          <a
            href="#book"
            className="text-amber-500 hover:text-white font-display font-black uppercase tracking-wider text-xs transition-colors"
          >
            Book Your Free Consultation Call Today »
          </a>
        </div>

      </div>
    </section>
  );
}
