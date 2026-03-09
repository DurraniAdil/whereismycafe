import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Vibe } from '../types/cafe';

interface FilterBarProps {
  selectedVibe: Vibe | 'ALL';
  onSelectVibe: (vibe: Vibe | 'ALL') => void;
}

const VIBES: (Vibe | 'ALL')[] = ['ALL', 'Study', 'Party', 'Chill', 'Date', 'Work'];

export const FilterBar: React.FC<FilterBarProps> = ({ selectedVibe, onSelectVibe }) => {
  return (
    <div className="sticky top-0 z-30 bg-[#F8F6F1]/90 backdrop-blur-md
                    border-b border-[#EAEEE8]/60 py-3">
      <div className="flex items-center gap-3 px-4">

        {/* ── Pills — scrollable, takes all remaining width ── */}
        <div className="flex flex-1 overflow-x-auto gap-2
                        [scrollbar-width:none] [-ms-overflow-style:none]
                        [&::-webkit-scrollbar]:hidden">
          {VIBES.map((vibe) => {
            const isActive = selectedVibe === vibe;
            return (
              <button
                key={vibe}
                onClick={() => onSelectVibe(vibe)}
                className="relative flex-shrink-0 focus:outline-none"
              >
                {/* Sliding blue pill */}
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-[#0b4e9d]
                               shadow-[0_3px_12px_rgba(11,78,157,0.32)]"
                  />
                )}

                <span
                  className={`relative z-10 flex items-center
                              px-4 py-2 rounded-full
                              text-[11px] font-black uppercase tracking-[0.14em]
                              transition-colors duration-200
                              ${isActive
                      ? 'text-white'
                      : 'text-[#8A9288] hover:text-[#0b4e9d]'
                    }`}
                >
                  {vibe === 'ALL' ? 'All' : vibe}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Desktop logo — links home, hidden on mobile ─── */}
        <Link
          to="/"
          className="hidden md:block flex-shrink-0 focus:outline-none group"
          aria-label="Back to home"
        >
          <img
            src={`${import.meta.env.BASE_URL}media/circle.png`}
            alt="Home"
            className="w-9 h-9 rounded-full object-cover
                       border-2 border-[#0b4e9d]/20
                       shadow-[0_2px_8px_rgba(11,78,157,0.15)]
                       group-hover:scale-105
                       group-hover:shadow-[0_4px_14px_rgba(11,78,157,0.28)]
                       group-hover:border-[#0b4e9d]/40
                       transition-all duration-200"
          />
        </Link>

      </div>
    </div>
  );
};
