import React from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, MapPin, Heart, Sparkles } from 'lucide-react';

export const CeremonyDetails: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
      {/* Premium ambient backdrop */}
      <div className="absolute top-0 right-0 w-[80%] h-[80%] bg-gradient-radial from-brand-beige/10 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        {/* Left Side: Text Content & Timeline */}
        <div className="lg:w-1/2 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <span className="text-brand-beige-deep uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[10px] sm:text-[11px] font-bold drop-shadow-sm">
                The Sacred Union
              </span>
              <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-brand-beige-deep/60 to-transparent" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display text-stone-800 mb-6 leading-[1.2] drop-shadow-sm">
              <span className="font-serif text-brand-beige-deep block font-medium">
                චතූර්යා සහ මහේෂ්
              </span>
            </h2>

            <p className="text-stone-600 font-serif text-lg sm:text-xl leading-relaxed mb-12 max-w-xl">
              ශ්‍රී සුභ මංගලම්! අතිනත ගැනීමේ ප්‍රීතිය නිමිත්තෙන් පැවැත්වෙන ප්‍රියසම්භාෂණයට සහභාගී වන මෙන් කෙරෙන ගෞරවණීය ආරාධනයයි.
            </p>

            {/* Premium Timeline */}
            <div className="relative space-y-12 ml-10 sm:ml-12 border-l-[1.5px] border-brand-beige/30 pl-10 sm:pl-12 py-4">

              {/* Calendar */}
              <div className="relative group">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-beige/40 shadow-lg flex items-center justify-center group-hover:border-brand-beige-deep group-hover:shadow-[0_4px_15px_rgba(176,137,104,0.3)] transition-all duration-500">
                  <Calendar className="w-5 h-5 text-brand-beige-deep group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-stone-800 mb-2 group-hover:text-brand-beige-deep transition-colors duration-500">2026 දෙසැම්බර් 03</h4>
                  <p className="text-stone-500/80 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">Thursday, December 03, 2026</p>
                </div>
              </div>

              {/* Clock */}
              <div className="relative group">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-beige/40 shadow-lg flex items-center justify-center group-hover:border-brand-beige-deep group-hover:shadow-[0_4px_15px_rgba(176,137,104,0.3)] transition-all duration-500">
                  <Clock className="w-5 h-5 text-brand-beige-deep group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-stone-800 mb-2 group-hover:text-brand-beige-deep transition-colors duration-500">පෙ.ව. 9.00 – ප.ව. 4.00</h4>
                  <p className="text-stone-500/80 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">9:00 AM to 4:00 PM</p>
                  <p className="text-brand-beige-deep text-[10px] mt-1 font-serif italic">(පෝරුවේ චාරිත්‍ර පෙ.ව. 9.45 ට)</p>
                </div>
              </div>

              {/* Location */}
              <div className="relative group">
                <div className="absolute top-1/2 -translate-y-1/2 -left-[64px] sm:-left-[74px] w-12 h-12 bg-white rounded-full border border-brand-beige/40 shadow-lg flex items-center justify-center group-hover:border-brand-beige-deep group-hover:shadow-[0_4px_15px_rgba(176,137,104,0.3)] transition-all duration-500">
                  <MapPin className="w-5 h-5 text-brand-beige-deep group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-2xl sm:text-3xl text-stone-800 mb-2 group-hover:text-brand-beige-deep transition-colors duration-500">Grand Rockland</h4>
                  <p className="text-stone-500/80 text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-bold">මාතර (Matara) · උත්සව ශාලාව</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Reception Details (Image removed per user request) */}
        {/*  */}
      </div>
    </div>
  );
};
