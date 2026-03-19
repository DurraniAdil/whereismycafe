import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCafeById, getCachedCafeById } from '../lib/getCafes';
import {
  ArrowLeft, MapPin, Instagram, TrendingUp, Sparkles,
  Plus, ChevronLeft, ChevronRight, X, Phone, Globe,
  Mail, MessageCircle, Wifi, Wind, Trees, Zap,
  Gamepad2, ParkingCircle, Star, Clock, Volume2,
  Sun, Music, Utensils, IndianRupee, Heart, Check, Share, Loader2, Share2, Upload
} from 'lucide-react';
import { VibeChip } from '../components/VibeChip';
import { useCollections } from '../hooks/useCollections.ts';
import { useShare } from '../hooks/useShare';
import { PageLoadingSkeleton } from '../components/PageLoadingSkeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import { motion, AnimatePresence } from 'motion/react';
import { Cafe } from '../types/cafe';
import { ReviewSection } from '../components/ReviewSection';


// ── Amenity config ──────────────────────────────────────────
const AMENITY_CONFIG: Record<string, { label: string; icon: React.FC<any> }> = {
  wifi: { label: 'WiFi', icon: Wifi },
  ac: { label: 'Air Conditioning', icon: Wind },
  outdoorSeating: { label: 'Outdoor Seating', icon: Trees },
  powerOutlets: { label: 'Power Outlets', icon: Zap },
  boardGames: { label: 'Board Games', icon: Gamepad2 },
  parking: { label: 'Parking', icon: ParkingCircle },
};

const levelToPercent: Record<string, number> = {
  Quiet: 25, Moderate: 60, Loud: 95,
  Dim: 25, Warm: 55, Bright: 90,
  None: 0, 'Lo-fi': 35, Bollywood: 65, Western: 65, Live: 95,
};

// ── Vibe Bar ────────────────────────────────────────────────
const VibeBar: React.FC<{
  icon: React.FC<any>; label: string; value: string; accent: string;
}> = ({ icon: Icon, label, value, accent }) => {
  const pct = levelToPercent[value] ?? 50;
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-xl bg-[#EAF0FB] flex items-center
                      justify-center flex-shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#0b4e9d]" />
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex justify-between items-baseline">
          <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#A8B0A0]">
            {label}
          </span>
          <span className="text-[12px] font-bold text-[#1E2020]">{value}</span>
        </div>
        <div className="h-1 w-full bg-[#EAF0FB] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className={`h-full rounded-full ${accent}`}
          />
        </div>
      </div>
    </div>
  );
};

// ── Lightbox ────────────────────────────────────────────────
const Lightbox: React.FC<{
  photos: string[]; index: number;
  onClose: () => void; onPrev: () => void; onNext: () => void;
  onSetIndex: (i: number) => void;
}> = ({ photos, index, onClose, onPrev, onNext, onSetIndex }) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext]);

  React.useEffect(() => {
    const el = scrollRef.current?.children[index] as HTMLElement;
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
  }, [index]);

  const handleScroll = () => {
    const c = scrollRef.current;
    if (!c) return;
    const i = Math.round(c.scrollLeft / c.clientWidth);
    if (i !== index && i >= 0 && i < photos.length) onSetIndex(i);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/96 flex flex-col"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 pt-6 pb-4 z-10"
        onClick={e => e.stopPropagation()}>
        <span className="text-white/30 text-[11px] font-bold tracking-[0.2em] uppercase">
          {index + 1} of {photos.length}
        </span>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full border border-white/10 flex items-center
                     justify-center text-white/50 hover:text-white
                     hover:border-white/30 transition-all">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex items-center relative" onClick={onClose}>
        <div ref={scrollRef} onScroll={handleScroll}
          onClick={e => e.stopPropagation()}
          className="w-full h-full flex overflow-x-auto snap-x snap-mandatory
                     [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{ scrollBehavior: 'smooth' }}>
          {photos.map((photo, i) => (
            <div key={i}
              className="w-full h-full flex-shrink-0 snap-center flex items-center
                         justify-center px-5">
              <img src={photo} alt=""
                className="max-h-[80vh] max-w-full object-contain rounded-2xl" />
            </div>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            <button onClick={e => { e.stopPropagation(); onPrev(); }}
              className="hidden md:flex absolute left-5 top-1/2 -translate-y-1/2
                         w-10 h-10 rounded-full border border-white/10
                         items-center justify-center text-white/40
                         hover:text-white hover:border-white/30 transition-all z-10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={e => { e.stopPropagation(); onNext(); }}
              className="hidden md:flex absolute right-5 top-1/2 -translate-y-1/2
                         w-10 h-10 rounded-full border border-white/10
                         items-center justify-center text-white/40
                         hover:text-white hover:border-white/30 transition-all z-10">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-8 pt-4"
          onClick={e => e.stopPropagation()}>
          {photos.map((_, i) => (
            <button key={i} onClick={() => onSetIndex(i)}
              className={`h-1 rounded-full transition-all duration-300
                          ${i === index ? 'w-6 bg-white' : 'w-1.5 bg-white/25'}`} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

// ── Gallery ─────────────────────────────────────────────────
const Gallery: React.FC<{
  photos: string[]; cafeName: string;
  onImageClick: (i: number) => void;
}> = ({ photos, cafeName, onImageClick }) => {
  const [expanded, setExpanded] = useState(false);
  const rest = photos.slice(1);
  if (!rest.length) return null;

  return (
    <div className="space-y-1.5">
      <button className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl"
        onClick={() => onImageClick(1)}>
        <img src={rest[0]} alt={cafeName}
          className="w-full h-full object-cover hover:scale-[1.03]
                     transition-transform duration-500" />
      </button>

      {rest.length >= 2 && (
        <div className="grid grid-cols-2 gap-1.5">
          <button className="relative aspect-square overflow-hidden rounded-2xl"
            onClick={() => onImageClick(2)}>
            <img src={rest[1]} alt={cafeName}
              className="w-full h-full object-cover hover:scale-[1.03]
                         transition-transform duration-500" />
          </button>

          <div className="relative aspect-square overflow-hidden rounded-2xl">
            <button className="w-full h-full"
              onClick={() => !expanded && rest.length > 3 ? setExpanded(true) : onImageClick(3)}>
              <img src={rest[2] ?? rest[1]} alt={cafeName}
                className={`w-full h-full object-cover transition-all duration-300
                            ${!expanded && rest.length > 3
                    ? 'brightness-[0.35]'
                    : 'hover:scale-[1.03]'}`} />
            </button>
            {!expanded && rest.length > 3 && (
              <button onClick={() => setExpanded(true)}
                className="absolute inset-0 flex flex-col items-center
                           justify-center text-white gap-2 pointer-events-none">
                <Plus className="w-5 h-5" />
                <span className="text-sm font-bold tracking-wide">
                  {rest.length - 2} more
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      <AnimatePresence>
        {expanded && rest.slice(3).map((photo, i) => (
          <motion.button key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="relative w-full aspect-[4/3] overflow-hidden rounded-2xl block"
            onClick={() => onImageClick(i + 4)}>
            <img src={photo} alt={cafeName}
              className="w-full h-full object-cover hover:scale-[1.03]
                         transition-transform duration-500" />
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ── Page ────────────────────────────────────────────────────
export const CafeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cafe, setCafe] = useState<Cafe | null>(id ? getCachedCafeById(id) : null);
  const [loading, setLoading] = useState(id ? !getCachedCafeById(id) : true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [missingType, setMissingType] = useState<'phone' | 'instagram' | 'website' | null>(null);

  const { isHearted, toggleHeart, isVisited, markVisited, removeVisited, getVisitDate } = useCollections();
  const { share, copied, sharing } = useShare();
  const hearted = id ? isHearted(id) : false;
  const visited = id ? isVisited(id) : false;
  const visitDate = id ? getVisitDate(id) : null;

  useEffect(() => {
    if (id) {
      getCafeById(id)
        .then(setCafe)
        .catch(err => setError(err.message || 'Failed to load cafe'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  // ── Loading & Errors ──────────────────────────────────────────
  const showSkeleton = useDelayedLoading(loading);

  if (error) return <div className="p-8 text-center text-red-500 font-medium">Error: {error}</div>;
  if (showSkeleton) return <PageLoadingSkeleton type="detail" />;
  if (loading && !cafe) return null;

  // ── Not found ──────────────────────────────────────────
  if (!cafe) return (
    <div className="min-h-screen flex flex-col items-center justify-center
                    bg-[#F8F6F1] gap-5">
      <div className="w-16 h-16 rounded-3xl bg-[#EAF0FB] flex items-center justify-center">
        <MapPin className="w-7 h-7 text-[#0b4e9d]" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-bold text-[#1E2020] mb-1"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Café not found
        </h2>
        <p className="text-sm text-[#7A8478]">
          This place doesn't exist in our list.
        </p>
      </div>
      <Link to="/"
        className="text-[11px] font-black uppercase tracking-[0.14em] text-white
                   bg-[#0b4e9d] px-6 py-3 rounded-2xl
                   shadow-[0_4px_14px_rgba(11,78,157,0.3)]
                   hover:bg-[#0a3d7a] transition-colors">
        Back home
      </Link>
    </div>
  );

  const activeAmenities = Object.entries(cafe.amenities)
    .filter(([, v]) => v)
    .map(([k]) => ({ key: k, ...AMENITY_CONFIG[k] }))
    .filter(a => a.label);

  const contactItems = [
    {
      type: 'phone' as const, icon: Phone, value: cafe.phone,
      href: cafe.phone ? `tel:${cafe.phone.replace(/[^0-9+]/g, '')}` : null
    },
    {
      type: 'instagram' as const, icon: Instagram, value: cafe.instagram,
      href: cafe.instagram ? `https://instagram.com/${cafe.instagram.replace('@', '')}` : null
    },
    {
      type: 'website' as const, icon: Globe, value: cafe.website,
      href: cafe.website ?? null
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F1] pb-36">

      {/* ── HERO ──────────────────────────────────────── */}
      <div className="relative h-[65vh] lg:h-[55vh] min-h-[400px] w-full overflow-hidden">
        <img src={cafe.photos[0]} alt={cafe.name}
          className="w-full h-full object-cover scale-[1.03]" />

        <div className="absolute inset-0 bg-gradient-to-t
                        from-black/85 via-black/20 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r
                        from-black/30 to-transparent" />

        {/* Film grain */}
        <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay pointer-events-none
          [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />

        {/* Back button */}
        <Link to="/"
          className="absolute top-5 left-5 z-10 w-9 h-9 rounded-full
                     bg-black/20 backdrop-blur-sm border border-white/10
                     flex items-center justify-center
                     text-white/80 hover:text-white hover:bg-black/40
                     transition-all">
          <ArrowLeft className="w-4 h-4" />
        </Link>

        {/* Badges */}
        <div className="absolute top-5 right-5 flex gap-2">
          {cafe.isTrending && (
            <span className="inline-flex items-center gap-1.5
                             bg-[#0b4e9d]/90 backdrop-blur-sm
                             text-white text-[10px] font-black
                             px-3 py-1.5 rounded-full uppercase tracking-[0.14em]
                             shadow-[0_2px_10px_rgba(11,78,157,0.4)]">
              <TrendingUp className="w-2.5 h-2.5" /> Trending
            </span>
          )}
          {cafe.isNewCafe && (
            <span className="inline-flex items-center gap-1.5
                             bg-[#2D6A4F]/90 backdrop-blur-sm
                             text-white text-[10px] font-black
                             px-3 py-1.5 rounded-full uppercase tracking-[0.14em]">
              <Sparkles className="w-2.5 h-2.5" /> New
            </span>
          )}
        </div>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-5 lg:px-10 pb-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}>

            {cafe.displayRating > 0 && (
              <div className="flex flex-col items-start gap-1.5 mb-3">
                <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm
                                border border-white/15 rounded-full px-2.5 py-1">
                  <Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" />
                  <span className="text-white text-xs font-bold">
                    {cafe.displayRating.toFixed(1)}
                  </span>
                  {cafe.displayReviewCount > 0 && (
                    <span className="text-white/60 text-[10px] font-medium ml-1">
                      ({cafe.displayReviewCount})
                    </span>
                  )}
                </div>
                <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest pl-1">
                  Blended Google + Community Rating
                </span>
              </div>
            )}

            <div className="flex items-center justify-between mb-2">
              <h1 className="text-[38px] lg:text-[52px] font-black text-white leading-[1.02]
                             tracking-tight italic pr-4"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {cafe.name}
              </h1>
            </div>

            <div className="flex items-center gap-1.5 text-white/45">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em]">
                {cafe.area.replace(', Aurangabad', '')}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── BODY ──────────────────────────────────────── */}
      <div className="px-5 pt-7 pb-8 max-w-5xl lg:max-w-7xl lg:px-10 mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-12">

          {/* ── MAIN CONTENT (Left on Desktop) ── */}
          <div className="space-y-12">
            {/* VIBES + DESCRIPTION + ACTIONS */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
                  {cafe.vibes.map(v => (
                    <VibeChip key={v} label={v} isActive className="cursor-default" />
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 bg-white rounded-full border border-[#EAEEE8] p-1 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                  <button
                    onClick={() => id && toggleHeart(id)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${hearted ? 'bg-[#EAF0FB] border-[#0b4e9d]/20 border' : 'bg-[#F4F4F0] hover:bg-gray-100'}`}
                    title={hearted ? "Saved" : "Save"}
                  >
                    <Heart className={`w-4 h-4 transition-colors ${hearted ? 'fill-[#E86A6A] text-[#E86A6A]' : 'text-[#A8B0A0]'}`} />
                  </button>
                  <button
                    onClick={() => id && (visited ? removeVisited(id) : markVisited(id))}
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${visited ? 'bg-[#EEF2E8] border-[#2D6A4F]/20 border' : 'bg-[#F4F4F0] hover:bg-gray-100'}`}
                    title={visited ? `Visited ${visitDate?.split(' ').slice(0, 2).join(' ')}` : "Mark Visited"}
                  >
                    <Check className={`w-4 h-4 transition-colors ${visited ? 'stroke-[3px] text-[#2D6A4F]' : 'text-[#A8B0A0]'}`} />
                  </button>
                  <button
                    disabled={sharing}
                    onClick={() => share({
                      cafeName: cafe.name,
                      cafeArea: cafe.area,
                      cafeId: cafe.id,
                      heroImageUrl: cafe.photos?.[0],
                      tagline: cafe.description,
                    })}
                    className={`w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 transition-all ${copied ? 'bg-[#EEF2E8] border-[#2D6A4F]/20 border' : 'bg-[#F4F4F0] hover:bg-gray-100'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                    title={copied ? 'Link Copied!' : 'Share'}
                  >
                    {sharing ? (
                      <Loader2 className="w-4 h-4 animate-spin text-[#6A7268]" />
                    ) : copied ? (
                      <Check className="w-4 h-4 transition-colors stroke-[3px] text-[#2D6A4F]" />
                    ) : (
                      <Upload className="w-4 h-4 transition-colors text-[#A8B0A0]" />
                    )}
                  </button>
                </div>
              </div>

              <p className="text-[17px] lg:text-[19px] text-[#6A7268] leading-[1.8] font-medium">
                {cafe.description}
              </p>
            </motion.section>

            {/* VIBE CHECK (PC) */}
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="hidden lg:block"
            >
              <div className="flex items-center gap-3 mb-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">Vibe Check</p>
                <div className="flex-1 h-px bg-[#EAEEE8]" />
              </div>
              <div className="bg-white rounded-3xl border border-[#EAEEE8] px-8 py-8 shadow-sm space-y-6">
                <VibeBar icon={Volume2} label="Noise" value={cafe.noiseLevel} accent="bg-[#0b4e9d]" />
                <div className="h-px bg-[#F0F2EC]" />
                <VibeBar icon={Sun} label="Lighting" value={cafe.lighting} accent="bg-amber-400" />
                <div className="h-px bg-[#F0F2EC]" />
                <VibeBar icon={Music} label="Music" value={cafe.music} accent="bg-violet-400" />
              </div>
            </motion.section>

            {/* AMENITIES (PC) */}
            {activeAmenities.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block"
              >
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">Amenities</p>
                  <div className="flex-1 h-px bg-[#EAEEE8]" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {activeAmenities.map(({ key, label, icon: Icon }) => (
                    <div key={key}
                      className="bg-white rounded-3xl border border-[#EAEEE8]
                                 px-4 py-5 flex flex-col items-center gap-3
                                 shadow-sm text-center group
                                 hover:border-[#0b4e9d]/20 transition-all hover:-translate-y-1">
                      <div className="w-10 h-10 rounded-2xl bg-[#EAF0FB]
                                      flex items-center justify-center
                                      group-hover:bg-[#0b4e9d] transition-colors">
                        <Icon className="w-5 h-5 text-[#0b4e9d]
                                         group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-[12px] font-bold text-[#5A6A58] leading-tight">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* REVIEWS (PC) */}
            <div className="hidden lg:block">
              <ReviewSection
                cafe={cafe}
                onRefresh={() => {
                  if (id) {
                    getCafeById(id).then(setCafe);
                  }
                }}
              />
            </div>

            {/* GALLERY (PC) */}
            {cafe.photos.length > 1 && (
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="hidden lg:block"
              >
                <div className="flex items-center gap-3 mb-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">Gallery</p>
                  <div className="flex-1 h-px bg-[#EAEEE8]" />
                </div>
                <Gallery
                  photos={cafe.photos}
                  cafeName={cafe.name}
                  onImageClick={i => setLightboxIndex(i)}
                />
              </motion.section>
            )}
          </div>

          {/* ── SIDEBAR (Right on Desktop) ── */}
          <aside className="space-y-8">
            <div className="lg:sticky lg:top-6 lg:self-start space-y-7">
              {/* QUICK INFO (Hours, Price, Contact) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* Price & Hours row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                  {/* Price */}
                  <div className="bg-white rounded-[2.5rem] border border-[#EAEEE8]
                                  px-6 py-6 flex flex-col justify-center gap-3 shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
                      Average spend for two
                    </span>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-5 h-5 text-[#0b4e9d]" />
                      <span className="text-[42px] font-black text-[#1E2020] leading-none tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {cafe.priceForTwo}
                      </span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="bg-white rounded-[2.5rem] border border-[#EAEEE8]
                                  px-6 py-6 flex flex-col justify-between shadow-sm">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
                      Opening Hours
                    </span>
                    <div className="flex items-center gap-2.5 mt-2">
                      <div className="w-8 h-8 rounded-full bg-[#EAF0FB] flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-[#0b4e9d]" />
                      </div>
                      <span className="text-base font-bold text-[#1E2020] leading-tight break-words">
                        {cafe.openingHours}
                      </span>
                    </div>
                    {cafe.closedOn && (
                      <span className="text-[11px] text-[#A8B0A0] font-bold uppercase tracking-wider mt-3 pl-11">
                        Closed: {cafe.closedOn}
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact icons row */}
                <div className="flex flex-row gap-3">
                  {contactItems.map(({ type, icon: Icon, value, href }) =>
                    value?.trim() && href ? (
                      <a key={type} href={href}
                        target={type !== 'phone' ? '_blank' : undefined}
                        rel="noreferrer"
                        className="w-full h-14 rounded-2xl bg-white border border-[#EAEEE8]
                                   flex items-center justify-center shadow-sm
                                   text-[#A8B0A0]
                                   hover:text-[#0b4e9d] hover:border-[#0b4e9d]/25
                                   hover:shadow-[0_4px_12px_rgba(11,78,157,0.12)]
                                   transition-all flex-1">
                        <Icon className="w-5 h-5" />
                      </a>
                    ) : (
                      <button key={type}
                        onClick={() => setMissingType(type)}
                        className="w-full h-14 rounded-2xl bg-[#F4F4F0] border border-[#EAEEE8]
                                   flex items-center justify-center
                                   text-[#C8D0C0] hover:text-[#A8B0A0]
                                   transition-all flex-1">
                        <Icon className="w-5 h-5" />
                      </button>
                    )
                  )}
                </div>
              </motion.div>

              {/* ORDER THIS */}
              {cafe.popularItem && (
                <motion.section
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <div className="bg-[#FEF4E8] rounded-[2.5rem] border border-[#F5D9A8]/50
                                  px-6 py-6 shadow-sm overflow-hidden relative">
                    <Utensils className="absolute -right-4 -bottom-4 w-24 h-24 text-[#B87A2A]/5 rotate-12" />
                    <div className="flex items-start gap-4 relative z-10">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[#F5D9A8]
                                      flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Utensils className="w-5 h-5 text-[#B87A2A]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.14em]
                                        text-[#B87A2A] block mb-1">
                          Popular item
                        </span>
                        <p className="text-[18px] font-bold text-[#1E2020] leading-snug"
                          style={{
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontStyle: 'italic'
                          }}>
                          {cafe.popularItem}
                        </p>
                        {cafe.cheapestItem && (
                          <p className="text-xs text-[#B87A2A]/70 font-bold mt-1 uppercase tracking-wider">
                            Starts at {cafe.cheapestItem}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.section>
              )}

              {/* MOBILE ONLY FALLBACKS (HIDDEN ON DESKTOP) */}
              <div className="lg:hidden space-y-12 pt-4">
                {/* Vibe Check (Mobile) */}
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0] mb-5">Vibe Check</p>
                  <div className="bg-white rounded-2xl border border-[#EAEEE8] px-5 py-5 shadow-sm space-y-5">
                    <VibeBar icon={Volume2} label="Noise" value={cafe.noiseLevel} accent="bg-[#0b4e9d]" />
                    <div className="h-px bg-[#F0F2EC]" />
                    <VibeBar icon={Sun} label="Lighting" value={cafe.lighting} accent="bg-amber-400" />
                    <div className="h-px bg-[#F0F2EC]" />
                    <VibeBar icon={Music} label="Music" value={cafe.music} accent="bg-violet-400" />
                  </div>
                </motion.section>

                {/* Amenities (Mobile) */}
                {activeAmenities.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0] mb-4">What's here</p>
                    <div className="grid grid-cols-3 gap-2">
                      {activeAmenities.map(({ key, label, icon: Icon }) => (
                        <div key={key} className="bg-white rounded-2xl border border-[#EAEEE8] px-3 py-4 flex flex-col items-center gap-2 shadow-sm text-center">
                          <div className="w-9 h-9 rounded-xl bg-[#EAF0FB] flex items-center justify-center">
                            <Icon className="w-4 h-4 text-[#0b4e9d]" />
                          </div>
                          <span className="text-[11px] font-bold text-[#5A6A58] leading-tight">{label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.section>
                )}

                {/* Reviews (Mobile) */}


                {/* Gallery (Mobile) */}
                {cafe.photos.length > 1 && (
                  <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0] mb-4">Gallery</p>
                    <Gallery photos={cafe.photos} cafeName={cafe.name} onImageClick={i => setLightboxIndex(i)} />
                  </motion.section>
                )}
                <ReviewSection
                  cafe={cafe}
                  onRefresh={() => {
                    if (id) {
                      getCafeById(id).then(setCafe);
                    }
                  }}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── STICKY CTA ──────────────────────────────── */}
      <div className="fixed bottom-14 md:bottom-0 left-0 right-0 z-30
                      bg-[#F8F6F1]/90 backdrop-blur-xl
                      border-t border-[#E4E8E0]/60 px-5 pt-4 pb-4 md:pb-6">
        <div className="max-w-5xl lg:max-w-7xl lg:px-10 mx-auto flex md:justify-end">
          <a href={cafe.googleMapsUrl} target="_blank" rel="noopener noreferrer"
            className="w-full md:w-auto md:min-w-[280px] flex items-center justify-center gap-2.5
                       bg-[#0b4e9d] text-white font-black
                       text-[11px] uppercase tracking-[0.14em]
                       py-4 px-10 rounded-2xl
                       shadow-[0_8px_25px_rgba(11,78,157,0.3)]
                       hover:bg-[#0a3d7a] hover:scale-[1.02] active:scale-[0.98]
                       transition-all duration-300">
            <MapPin className="w-4 h-4" />
            Take me there
          </a>
        </div>
      </div>

      {/* ── LIGHTBOX ────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            photos={cafe.photos}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onPrev={() => setLightboxIndex((lightboxIndex - 1 + cafe.photos.length) % cafe.photos.length)}
            onNext={() => setLightboxIndex((lightboxIndex + 1) % cafe.photos.length)}
            onSetIndex={setLightboxIndex}
          />
        )}
      </AnimatePresence>

      {/* ── MISSING INFO MODAL ──────────────────────── */}
      <AnimatePresence>
        {missingType && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center
                          justify-center px-4 pb-24 sm:pb-0">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMissingType(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-full max-w-sm bg-white rounded-3xl p-7 shadow-2xl"
            >
              <button onClick={() => setMissingType(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full
                           bg-[#EAF0FB] flex items-center justify-center
                           text-[#0b4e9d] hover:bg-[#0b4e9d] hover:text-white
                           transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-[#EAF0FB] flex items-center
                              justify-center mb-5">
                {missingType === 'phone' && <Phone className="w-5 h-5 text-[#0b4e9d]" />}
                {missingType === 'instagram' && <Instagram className="w-5 h-5 text-[#0b4e9d]" />}
                {missingType === 'website' && <Globe className="w-5 h-5 text-[#0b4e9d]" />}
              </div>

              <h3 className="text-xl font-bold text-[#1E2020] mb-2"
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontStyle: 'italic'
                }}>
                Not available yet
              </h3>
              <p className="text-[14px] text-[#7A8478] leading-relaxed mb-6">
                We don't have this café's {missingType} on record.
                If ya know about it then just message me, or if you want to explore the WIMC studio!
              </p>

              <div className="space-y-2.5">
                <a href="https://wimc-studio.vercel.app" target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2.5
                             bg-[#0b4e9d] text-white py-3.5 rounded-2xl
                             font-black text-[11px] uppercase tracking-[0.14em]
                             shadow-[0_4px_14px_rgba(11,78,157,0.3)]
                             hover:bg-[#0a3d7a] transition-colors">
                  <Sparkles className="w-4 h-4" />
                  WIMC Studio
                </a>
                <a href={`https://wa.me/917028512087?text=${encodeURIComponent(`Here is the ${missingType} for ${cafe?.name}: `)}`} target="_blank" rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2.5
                             bg-[#25D366] text-white py-3.5 rounded-2xl
                             font-black text-[11px] uppercase tracking-[0.14em]
                             hover:bg-[#1fba58] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
