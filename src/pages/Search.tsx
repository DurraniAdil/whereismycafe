import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getAllCafes, isOpenNow } from '../lib/getCafes';
import { CafeCard } from '../components/CafeCard';
import { Cafe, Vibe, NoiseLevel } from '../types/cafe';
import { useLogoClick } from '../hooks/useLogoClick';
import {
  Search as SearchIcon, SlidersHorizontal, X,
  ChevronLeft, ChevronRight,
  Wifi, Wind, Trees, ParkingCircle, Star,
  Clock, MapPin, Volume2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Navigation } from 'lucide-react';

const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const PER_PAGE = 9;

const RATING_OPTIONS = [
  { label: 'Any', value: 0 },
  { label: '4.0+', value: 4.0 },
  { label: '4.5+', value: 4.5 },
  { label: '4.8+', value: 4.8 },
];

const AMENITY_FILTERS = [
  { key: 'wifi' as const, label: 'WiFi', icon: Wifi },
  { key: 'ac' as const, label: 'AC', icon: Wind },
  { key: 'outdoorSeating' as const, label: 'Outdoor', icon: Trees },
  { key: 'parking' as const, label: 'Parking', icon: ParkingCircle },
];

const NOISE_OPTIONS: { value: NoiseLevel }[] = [
  { value: 'Quiet' },
  { value: 'Moderate' },
  { value: 'Loud' },
];

import { ZONES, ALL_ZONED_CAFES } from '../lib/zones';

// ── Shared active / idle pill classes ──────────────────────
const ACTIVE_PILL = 'bg-[#0b4e9d] text-white shadow-[0_3px_10px_rgba(11,78,157,0.28)]';
const IDLE_PILL = 'bg-[#F0F2EC] text-[#7A8478] hover:bg-[#EBF1FB] hover:text-[#0b4e9d]';

// ── Filter Panel ────────────────────────────────────────────
interface FilterPanelProps {
  minRating: number; setMinRating: (v: number) => void;
  openNow: boolean; setOpenNow: (v: boolean) => void;
  selectedZone: string; setSelectedZone: (v: string) => void;
  selectedAmenities: string[]; toggleAmenity: (k: string) => void;
  selectedNoise: NoiseLevel | ''; setSelectedNoise: (v: NoiseLevel | '') => void;
  maxPrice: number; setMaxPrice: (v: number) => void;
  showNearbyMode: boolean; setShowNearbyMode: (v: boolean) => void;
  nearbyRadius: number; setNearbyRadius: (v: number) => void;
  userPos: [number, number] | null; toggleNearbyMode: () => void;
  locating: boolean;
  setPage: (v: number) => void;
  hasActiveFilters: boolean; clearAll: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  minRating, setMinRating, openNow, setOpenNow,
  selectedZone, setSelectedZone, selectedAmenities, toggleAmenity,
  selectedNoise, setSelectedNoise, maxPrice, setMaxPrice,
  showNearbyMode, setShowNearbyMode, nearbyRadius, setNearbyRadius,
  userPos, toggleNearbyMode, locating,
  setPage, hasActiveFilters, clearAll,
}) => (
  <div className="space-y-6">

    {/* Header */}
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E2020]">
        Filters
      </p>
      {hasActiveFilters && (
        <button onClick={clearAll}
          className="text-[11px] font-bold text-[#0b4e9d] hover:text-[#0a3d7a]
                     flex items-center gap-1 transition-colors">
          <X className="w-3 h-3" /> Clear all
        </button>
      )}
    </div>

    {/* ── Rating ─────────────────────────────────── */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Star className="w-3.5 h-3.5 text-[#A8B0A0]" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
          Rating
        </p>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {RATING_OPTIONS.map(opt => (
          <button key={opt.value}
            onClick={() => { setMinRating(opt.value); setPage(1); }}
            className={`py-2 rounded-xl text-[11px] font-bold transition-all
                        ${minRating === opt.value ? ACTIVE_PILL : IDLE_PILL}`}>
            {opt.label}
          </button>
        ))}
      </div>
    </div>

    {/* ── Near Me ───────────────────────────────── */}
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-[#A8B0A0]" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
            Near Me
          </p>
        </div>
        <button
          onClick={toggleNearbyMode}
          className={`relative w-12 h-7 rounded-full transition-colors duration-200
                      ${showNearbyMode ? 'bg-[#0b4e9d]' : 'bg-[#D8DDD0]'}`}>
          <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px]
                            rounded-full bg-white shadow-md transition-transform duration-200 flex items-center justify-center
                            ${showNearbyMode ? 'translate-x-[20px]' : 'translate-x-0'}`}>
            {locating ? (
              <Navigation className="w-2.5 h-2.5 text-[#0b4e9d] animate-pulse" />
            ) : showNearbyMode ? (
              <Eye className="w-2.5 h-2.5 text-[#0b4e9d]" />
            ) : (
              <EyeOff className="w-2.5 h-2.5 text-[#7A8478]" />
            )}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {showNearbyMode && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 pt-1 pb-2">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold text-[#1E2020] uppercase tracking-wider">
                  Radius: {nearbyRadius}km
                </span>

              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={nearbyRadius}
                onChange={(e) => { setNearbyRadius(parseInt(e.target.value)); setPage(1); }}
                className="w-full accent-[#0b4e9d] h-1.5 rounded-full cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#A8B0A0] font-medium">
                <span>1km</span><span>10km</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    <div className="h-px bg-[#EAEEE8]" />

    {/* ── Open Now ───────────────────────────────── */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-[#A8B0A0]" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
          Open Now
        </p>
      </div>
      <button
        onClick={() => { setOpenNow(!openNow); setPage(1); }}
        className={`relative w-12 h-7 rounded-full transition-colors duration-200
                    ${openNow ? 'bg-[#0b4e9d]' : 'bg-[#D8DDD0]'}`}>
        <span className={`absolute top-[3px] left-[3px] w-[22px] h-[22px]
                          rounded-full bg-white shadow-md transition-transform duration-200
                          ${openNow ? 'translate-x-[20px]' : 'translate-x-0'}`} />
      </button>
    </div>

    <div className="h-px bg-[#EAEEE8]" />

    {/* ── Zone ───────────────────────────────────── */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-3.5 h-3.5 text-[#A8B0A0]" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
          Zone
        </p>
      </div>
      <div className="space-y-1.5">
        {[
          { value: '', label: 'All Zones' },
          ...ZONES.map(z => ({ value: z.label, label: z.label })),
          { value: '__explore__', label: 'Explore (unlisted)' },
        ].map(({ value, label }) => (
          <button key={value}
            onClick={() => { setSelectedZone(value); setPage(1); }}
            className={`w-full text-left px-3 py-2.5 rounded-xl
                        text-[11px] font-bold transition-all
                        ${selectedZone === value ? ACTIVE_PILL : IDLE_PILL}`}>
            {label}
          </button>
        ))}
      </div>
    </div>

    <div className="h-px bg-[#EAEEE8]" />

    {/* ── Amenities ──────────────────────────────── */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Wifi className="w-3.5 h-3.5 text-[#A8B0A0]" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
          Amenities
        </p>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {AMENITY_FILTERS.map(am => {
          const Icon = am.icon;
          const active = selectedAmenities.includes(am.key);
          return (
            <button key={am.key}
              onClick={() => toggleAmenity(am.key)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl
                          text-[11px] font-bold transition-all
                          ${active ? ACTIVE_PILL : IDLE_PILL}`}>
              <Icon className="w-3.5 h-3.5" />
              {am.label}
            </button>
          );
        })}
      </div>
    </div>

    <div className="h-px bg-[#EAEEE8]" />

    {/* ── Noise Level ────────────────────────────── */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Volume2 className="w-3.5 h-3.5 text-[#A8B0A0]" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
          Noise
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {NOISE_OPTIONS.map(({ value }) => (
          <button key={value}
            onClick={() => {
              setSelectedNoise(selectedNoise === value ? '' : value);
              setPage(1);
            }}
            className={`py-2.5 rounded-xl text-[11px] font-bold transition-all
                        ${selectedNoise === value ? ACTIVE_PILL : IDLE_PILL}`}>
            {value}
          </button>
        ))}
      </div>
    </div>

    <div className="h-px bg-[#EAEEE8]" />

    {/* ── Budget ─────────────────────────────────── */}
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
          Budget for Two
        </p>
        <span className="text-[11px] font-black text-[#0b4e9d]
                         bg-[#EAF0FB] px-2.5 py-1 rounded-lg">
          ₹{maxPrice}{maxPrice === 2000 ? '+' : ''}
        </span>
      </div>
      <input
        type="range" min="100" max="2000" step="50"
        value={maxPrice}
        onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
        className="w-full accent-[#0b4e9d] h-1.5 rounded-full cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-[#A8B0A0] mt-1.5 font-medium">
        <span>₹100</span><span>₹2000+</span>
      </div>
    </div>

  </div>
);

// ── Main Page ───────────────────────────────────────────────
export const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const vibeFromHome = searchParams.get('vibe') as Vibe | null;
  const handleLogoClick = useLogoClick();

  const [query, setQuery] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [openNow, setOpenNow] = useState(false);
  const [selectedZone, setSelectedZone] = useState(searchParams.get('zone') || '');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedNoise, setSelectedNoise] = useState<NoiseLevel | ''>('');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [page, setPage] = useState(1);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [showNearbyMode, setShowNearbyMode] = useState(false);
  const [nearbyRadius, setNearbyRadius] = useState(1); // default 1km
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const [allCafes, setAllCafes] = useState<Cafe[]>([]);
  const [loadingCafes, setLoadingCafes] = useState(true);
  const [errorCafes, setErrorCafes] = useState<string | null>(null);

  useEffect(() => {
    getAllCafes()
      .then(setAllCafes)
      .catch(err => setErrorCafes(err.message || 'Failed to load cafes'))
      .finally(() => setLoadingCafes(false));
  }, []);

  // Body scroll lock for mobile filters
  useEffect(() => {
    if (showMobileFilters) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('filter-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('filter-open');
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('filter-open');
    };
  }, [showMobileFilters]);

  const toggleAmenity = (key: string) => {
    setSelectedAmenities(prev =>
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    );
    setPage(1);
  };

  const hasActiveFilters =
    minRating > 0 || openNow || selectedZone !== '' ||
    selectedAmenities.length > 0 || selectedNoise !== '' ||
    maxPrice < 2000 || query.length > 0 || showNearbyMode;

  const clearAll = () => {
    setMinRating(0); setOpenNow(false); setSelectedZone('');
    setSelectedAmenities([]); setSelectedNoise('');
    setMaxPrice(2000); setQuery(''); setPage(1);
    setShowNearbyMode(false); setNearbyRadius(1);
  };

  const flyToUser = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setShowNearbyMode(false);
        setLocError('Location access denied');
      },
      { timeout: 8000 }
    );
  };

  const toggleNearbyMode = () => {
    if (!showNearbyMode) {
      if (!userPos) flyToUser();
      setShowNearbyMode(true);
    } else {
      setShowNearbyMode(false);
    }
    setPage(1);
  };

  const filterProps = {
    minRating, setMinRating, openNow, setOpenNow,
    selectedZone, setSelectedZone, selectedAmenities, toggleAmenity,
    selectedNoise, setSelectedNoise, maxPrice, setMaxPrice,
    showNearbyMode, setShowNearbyMode, nearbyRadius, setNearbyRadius,
    userPos, toggleNearbyMode, locating,
    setPage, hasActiveFilters, clearAll,
  };

  const filteredCafes = useMemo(() => {
    return allCafes.filter(cafe => {
      const matchesQuery =
        cafe.name.toLowerCase().includes(query.toLowerCase()) ||
        cafe.area.toLowerCase().includes(query.toLowerCase());
      const matchesVibe = !vibeFromHome || cafe.vibes.includes(vibeFromHome);
      const matchesRating = !minRating || (cafe.rating && cafe.rating >= minRating);
      const matchesOpen = !openNow || isOpenNow(cafe);
      let matchesZone = true;
      if (selectedZone === '__explore__') {
        matchesZone = !ALL_ZONED_CAFES.includes(cafe.name.toLowerCase());
      } else if (selectedZone) {
        const zone = ZONES.find(z => z.label === selectedZone);
        matchesZone = zone ? zone.cafes.some(n => n.toLowerCase() === cafe.name.toLowerCase()) : true;
      }
      const matchesAmenities = selectedAmenities.length === 0 ||
        selectedAmenities.every(key => (cafe.amenities as any)[key] === true);
      const matchesNoise = !selectedNoise || cafe.noiseLevel === selectedNoise;
      const matchesPrice = cafe.priceForTwo <= maxPrice;

      let matchesNearby = true;
      if (showNearbyMode && userPos && cafe.latitude && cafe.longitude) {
        const dist = haversine(userPos[0], userPos[1], cafe.latitude, cafe.longitude);
        matchesNearby = dist <= nearbyRadius;
      }

      return matchesQuery && matchesVibe && matchesRating && matchesOpen &&
        matchesZone && matchesAmenities && matchesNoise && matchesPrice && matchesNearby;
    });
  }, [query, vibeFromHome, minRating, openNow, selectedZone,
    selectedAmenities, selectedNoise, maxPrice, allCafes, showNearbyMode, userPos, nearbyRadius]);

  const totalPages = Math.ceil(filteredCafes.length / PER_PAGE);
  const paginatedCafes = filteredCafes.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const scrollToResults = () =>
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const activeFilterCount = [
    minRating > 0, openNow, selectedZone !== '',
    selectedNoise !== '', maxPrice < 2000,
    ...selectedAmenities.map(() => true),
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8F6F1]">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="bg-[#F8F6F1] px-4 pt-8 pb-6">
        <div className="max-w-6xl mx-auto">

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E2020] tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Find a Café
              </h1>
              {vibeFromHome ? (
                <p className="text-sm text-[#7A8478] mt-1">
                  Filtered for{' '}
                  <span className="font-black text-[#0b4e9d] bg-[#EAF0FB]
                                   px-2 py-0.5 rounded-lg text-[11px] uppercase tracking-wider">
                    {vibeFromHome}
                  </span>{' '}
                  vibes
                </p>
              ) : (
                <p className="text-sm text-[#7A8478] mt-1">
                  {allCafes.length} cafés in Aurangabad
                </p>
              )}
            </div>
            {/* Desktop Back Logo */}
            <Link to="/" className="hidden md:block fixed top-6 right-6 z-50">
              <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Home"
                className="w-12 h-12 rounded-full object-cover shadow-[0_4px_24px_rgba(11,78,157,0.25)] border-2 border-white hover:scale-105 transition-transform cursor-pointer" />
            </Link>

            {/* Mobile Logo */}
            <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="logo" onClick={handleLogoClick}
              className="w-12 h-12 rounded-full object-cover cursor-pointer
                         border-2 border-white md:hidden
                         shadow-[0_2px_10px_rgba(11,78,157,0.18)]
                         hover:scale-105 transition-transform" />
          </div>

          {/* Search bar */}
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2
                                   text-[#A8B0A0] w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or area..."
              className="w-full bg-white text-[#1E2020] placeholder-[#A8B0A0]
                         rounded-2xl pl-11 pr-14 py-4 text-sm font-medium
                         border border-[#EAEEE8]
                         focus:outline-none focus:ring-2 focus:ring-[#0b4e9d]/15
                         focus:border-[#0b4e9d]/30 transition-all shadow-sm"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6
                           rounded-full bg-[#EAF0FB] flex items-center justify-center
                           hover:bg-[#0b4e9d] group transition-colors">
                <X className="w-3.5 h-3.5 text-[#0b4e9d] group-hover:text-white
                               transition-colors" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* ── Body ──────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="flex gap-6 items-start">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl border border-[#EAEEE8]
                            shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-5">
              <FilterPanel {...filterProps} />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0" ref={resultsRef}>

            {/* Results bar */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#0b4e9d]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  {filteredCafes.length}
                </span>
                <span className="text-sm text-[#7A8478] font-medium">
                  café{filteredCafes.length !== 1 ? 's' : ''} found
                </span>
              </div>

              {/* Mobile filter button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-2xl
                           bg-white border border-[#EAEEE8] text-[#1E2020]
                           text-[11px] font-black uppercase tracking-[0.1em]
                           shadow-sm hover:border-[#0b4e9d]/25
                           hover:shadow-[0_4px_12px_rgba(11,78,157,0.10)]
                           transition-all relative">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full
                                   bg-[#0b4e9d] text-white text-[10px] font-black
                                   flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active filter chips */}
            {hasActiveFilters && (
              <div className="lg:hidden flex flex-wrap gap-2 mb-4">
                {minRating > 0 && (
                  <span className="flex items-center gap-1 bg-[#0b4e9d] text-white
                                   text-[11px] font-bold px-3 py-1.5 rounded-full">
                    ⭐ {minRating}+
                    <button onClick={() => setMinRating(0)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
                {openNow && (
                  <span className="flex items-center gap-1 bg-[#0b4e9d] text-white
                                   text-[11px] font-bold px-3 py-1.5 rounded-full">
                    🕐 Open now
                    <button onClick={() => setOpenNow(false)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
                {selectedZone && selectedZone !== '__explore__' && (
                  <span className="flex items-center gap-1 bg-[#0b4e9d] text-white
                                   text-[11px] font-bold px-3 py-1.5 rounded-full">
                    {selectedZone.split('/')[0].trim()}
                    <button onClick={() => setSelectedZone('')}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
                {selectedAmenities.map(key => (
                  <span key={key}
                    className="flex items-center gap-1 bg-[#0b4e9d] text-white
                               text-[11px] font-bold px-3 py-1.5 rounded-full">
                    {AMENITY_FILTERS.find(a => a.key === key)?.label}
                    <button onClick={() => toggleAmenity(key)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                ))}
                {maxPrice < 2000 && (
                  <span className="flex items-center gap-1 bg-[#0b4e9d] text-white
                                   text-[11px] font-bold px-3 py-1.5 rounded-full">
                    ₹{maxPrice} max
                    <button onClick={() => setMaxPrice(2000)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
                {showNearbyMode && (
                  <span className="flex items-center gap-1 bg-[#0b4e9d] text-white
                                   text-[11px] font-bold px-3 py-1.5 rounded-full">
                    {nearbyRadius}km
                    <button onClick={() => setShowNearbyMode(false)}>
                      <X className="w-3 h-3 ml-0.5" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Grid */}
            {filteredCafes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {paginatedCafes.map((cafe, i) => (
                    <motion.div key={cafe.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.04 }}>
                      <CafeCard cafe={cafe} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => { setPage(p => Math.max(1, p - 1)); scrollToResults(); }}
                      disabled={page === 1}
                      className="w-10 h-10 rounded-full flex items-center justify-center
                                 border border-[#EAEEE8] bg-white text-[#1E2020]
                                 disabled:opacity-30 disabled:cursor-not-allowed
                                 hover:border-[#0b4e9d]/25 hover:text-[#0b4e9d]
                                 transition-colors shadow-sm">
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p}
                        onClick={() => { setPage(p); scrollToResults(); }}
                        className={`w-10 h-10 rounded-full text-sm font-bold transition-all
                                    ${p === page
                            ? ACTIVE_PILL
                            : 'bg-white text-[#7A8478] hover:bg-[#EAF0FB] hover:text-[#0b4e9d] border border-[#EAEEE8]'
                          }`}>
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => { setPage(p => Math.min(totalPages, p + 1)); scrollToResults(); }}
                      disabled={page === totalPages}
                      className="w-10 h-10 rounded-full flex items-center justify-center
                                 border border-[#EAEEE8] bg-white text-[#1E2020]
                                 disabled:opacity-30 disabled:cursor-not-allowed
                                 hover:border-[#0b4e9d]/25 hover:text-[#0b4e9d]
                                 transition-colors shadow-sm">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-28 text-center">
                <div className="w-20 h-20 rounded-3xl bg-[#EAF0FB] flex items-center
                                justify-center mb-5">
                  <SearchIcon className="w-8 h-8 text-[#0b4e9d]/40" />
                </div>
                <h3 className="text-lg font-bold text-[#1E2020] mb-2"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                  No cafés found
                </h3>
                <p className="text-sm text-[#7A8478] max-w-[200px] leading-relaxed mb-6">
                  Try adjusting your filters or search term.
                </p>
                <button onClick={clearAll}
                  className="text-[11px] font-black uppercase tracking-[0.14em]
                             text-white bg-[#0b4e9d] px-6 py-3 rounded-2xl
                             hover:bg-[#0a3d7a] transition-colors
                             shadow-[0_4px_14px_rgba(11,78,157,0.3)]">
                  Reset everything
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ─────────────────────────── */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />

            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="lg:hidden fixed right-0 top-0 bottom-0 w-[85vw] max-w-sm
                         z-50 bg-[#F8F6F1] shadow-2xl flex flex-col">

              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 pt-6 pb-4
                              border-b border-[#EAEEE8]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#1E2020]">
                  Filters
                </p>
                <button onClick={() => setShowMobileFilters(false)}
                  className="w-9 h-9 rounded-2xl bg-[#EAF0FB] flex items-center justify-center
                             hover:bg-[#0b4e9d] group transition-colors">
                  <X className="w-4 h-4 text-[#0b4e9d] group-hover:text-white transition-colors" />
                </button>
              </div>

              {/* Scrollable */}
              <div className="flex-1 overflow-y-auto px-5 py-5 pb-10">
                <FilterPanel {...filterProps} />
              </div>

              {/* Apply */}
              <div className="px-5 py-5 border-t border-[#EAEEE8] bg-[#F8F6F1]">
                <button onClick={() => setShowMobileFilters(false)}
                  className="w-full py-4 rounded-2xl bg-[#0b4e9d] text-white
                             text-[11px] font-black uppercase tracking-[0.14em]
                             hover:bg-[#0a3d7a] transition-colors
                             shadow-[0_4px_14px_rgba(11,78,157,0.30)]">
                  Show {filteredCafes.length} café{filteredCafes.length !== 1 ? 's' : ''}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
