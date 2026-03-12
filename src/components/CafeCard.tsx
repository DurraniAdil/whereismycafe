import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, TrendingUp, Sparkles, ArrowUpRight } from 'lucide-react';
import { Cafe } from '../types/cafe';

interface CafeCardProps {
  cafe: Cafe;
}

// Vibe chips keep their own categorical palette — they're data, not brand
const VIBE_CONFIG: Record<string, { color: string }> = {
  Study: { color: 'bg-[#EEF2E8] text-[#4A6741]' },
  Chill: { color: 'bg-[#E8EFF9] text-[#1B4F9C]' },   // nudged to blue family
  Date: { color: 'bg-[#FCEEF0] text-[#9B3A4A]' },
  Party: { color: 'bg-[#FEF4E8] text-[#8A5A1A]' },
  Work: { color: 'bg-[#EAF0FB] text-[#0b4e9d]' },   // logo blue
};

export const CafeCard: React.FC<CafeCardProps> = ({ cafe }) => {
  const primaryVibe = cafe.vibes[0];
  const vibeConf = VIBE_CONFIG[primaryVibe] ?? { color: 'bg-[#F0F2EC] text-[#5A5A5A]' };

  const priceLabel =
    cafe.priceForTwo <= 150 ? '₹' :
      cafe.priceForTwo <= 300 ? '₹₹' :
        cafe.priceForTwo <= 500 ? '₹₹₹' : '₹₹₹₹';

  return (
    <Link to={`/cafes/${cafe.id}`} className="block group focus:outline-none">
      <div className="relative bg-white rounded-[28px] overflow-hidden
                      border border-[#EAEAE6]
                      shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                      hover:shadow-[0_16px_48px_rgba(11,78,157,0.13)]
                      hover:-translate-y-1.5
                      transition-all duration-400 ease-out
                      flex flex-col h-full">

        {/* ── Image ─────────────────────────────────── */}
        <div className="relative aspect-[3/2] overflow-hidden bg-[#EFEFEB] flex-shrink-0">
          {cafe.photos?.[0] ? (
            <img
              src={cafe.photos[0]}
              alt={cafe.name}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover
                         transition-transform duration-700 ease-out
                         group-hover:scale-[1.06]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center
                            bg-gradient-to-br from-[#EBF1FB] to-[#D8E6F7]">
              <span className="text-5xl mb-2 opacity-40">☕</span>
              <span className="text-[11px] text-[#7A9CC8] font-semibold uppercase tracking-wider">
                Photo coming soon
              </span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t
                          from-black/55 via-black/5 to-transparent" />

          {/* ── Top-left badges ──────────────────────── */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {cafe.isTrending && (
              <span className="inline-flex items-center gap-1
                               bg-[#0b4e9d] text-white
                               text-[10px] font-bold tracking-wider uppercase
                               px-2.5 py-1 rounded-full
                               shadow-[0_2px_8px_rgba(11,78,157,0.45)]">
                <TrendingUp className="w-2.5 h-2.5" />
                Hot
              </span>
            )}
            {cafe.isNewCafe && (
              <span className="inline-flex items-center gap-1
                               bg-white text-[#0b4e9d]
                               border border-[#0b4e9d]/20
                               text-[10px] font-bold tracking-wider uppercase
                               px-2.5 py-1 rounded-full
                               shadow-[0_2px_8px_rgba(11,78,157,0.18)]">
                <Sparkles className="w-2.5 h-2.5" />
                New
              </span>
            )}
          </div>

          {/* ── Top-right: arrow on hover ────────────── */}
          <div className="absolute top-3 right-3
                          w-8 h-8 rounded-full
                          flex items-center justify-center
                          bg-[#0b4e9d]/70 group-hover:bg-[#0b4e9d]
                          transition-all duration-300 shadow-md">
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>

          {/* ── Bottom: rating + price ───────────────── */}
          <div className="absolute bottom-3 left-3 right-3
                          flex items-end justify-between">
            {cafe.displayRating > 0 && (
              <div className="inline-flex items-center gap-1.5
                              bg-white/95 backdrop-blur-sm
                              rounded-full px-2.5 py-1.5 shadow-sm">
                <Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" />
                <span className="text-[12px] font-bold text-[#1E2020]">
                  {cafe.displayRating.toFixed(1)}
                </span>
                {cafe.displayReviewCount > 0 && (
                  <span className="text-[10px] text-[#7A8478] font-medium ml-0.5">
                    ({cafe.displayReviewCount})
                  </span>
                )}
              </div>
            )}

            <div className="inline-flex items-center
                            bg-white/20 backdrop-blur-sm border border-white/30
                            rounded-full px-2.5 py-1 ml-auto">
              <span className="text-[12px] font-bold text-white tracking-wide">
                {priceLabel}
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────── */}
        <div className="flex flex-col flex-grow px-4 pt-3.5 pb-4 gap-2.5">

          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-bold leading-snug line-clamp-1 italic
                             text-[#0b4e9d] transition-colors duration-200"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {cafe.name}
              </h3>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-[#B0B8A8] flex-shrink-0" />
                <span className="text-[11px] text-[#A0A89A] truncate font-medium
                                 uppercase tracking-wider">
                  {cafe.area.replace(', Aurangabad', '')}
                </span>
              </div>
            </div>
          </div>

          {/* Vibe chips */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            {cafe.vibes.slice(0, 3).map((vibe) => {
              const conf = VIBE_CONFIG[vibe] ?? { color: 'bg-[#F0F2EC] text-[#5A5A5A]' };
              return (
                <span key={vibe}
                  className={`text-[10px] font-bold uppercase tracking-wider
                              px-2.5 py-1 rounded-full ${conf.color}`}>
                  {vibe}
                </span>
              );
            })}
            {cafe.vibes.length > 3 && (
              <span className="text-[11px] text-[#B0B8A8] font-medium self-center">
                +{cafe.vibes.length - 3}
              </span>
            )}
          </div>

        </div>

        {/* ── Bottom accent line ─────────────────────── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2.5px]
                        bg-[#0b4e9d] rounded-full
                        scale-x-[0.3] group-hover:scale-x-100
                        origin-left transition-transform duration-400 ease-out" />

      </div>
    </Link>
  );
};
