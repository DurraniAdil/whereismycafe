import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight, BookmarkX, MapPin, X, Coffee } from 'lucide-react';
import { getAllCafes } from '../lib/getCafes';
import { CafeCard } from '../components/CafeCard';
import { useCollections } from '../hooks/useCollections';
import { useLogoClick } from '../hooks/useLogoClick';

// ── Fade-up wrapper ─────────────────────────────────────────
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({
    children, delay = 0,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    >
        {children}
    </motion.div>
);

export const Collections: React.FC = () => {
    const handleLogoClick = useLogoClick();
    const {
        heartedIds, visitedEntries,
        toggleHeart, removeVisited, getVisitDate
    } = useCollections();

    type Tab = 'saved' | 'visited';
    const [activeTab, setActiveTab] = useState<Tab>('saved');

    const allCafes = getAllCafes();
    const savedCafes = allCafes.filter(c => heartedIds.includes(c.id));

    // Maintain sorted order for visited cafes
    const visitedCafes = visitedEntries
        .map(entry => allCafes.find(c => c.id === entry.id))
        .filter((c): c is NonNullable<typeof c> => !!c);

    return (
        <div className="min-h-screen bg-[#F8F6F1] pb-28">

            {/* Mobile logo */}
            <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="logo"
                onClick={handleLogoClick}
                className="md:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-full
                   object-cover cursor-pointer border-2 border-white
                   shadow-[0_2px_10px_rgba(11,78,157,0.18)]
                   hover:scale-105 transition-transform" />

            {/* Desktop Back Logo */}
            <Link to="/" className="hidden md:block fixed top-6 right-6 z-50">
                <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Home"
                    className="w-12 h-12 rounded-full object-cover shadow-[0_4px_24px_rgba(11,78,157,0.25)] border-2 border-white hover:scale-105 transition-transform cursor-pointer" />
            </Link>

            {/* ── HERO ──────────────────────────────────────────── */}
            <div className="px-5 pt-12 pb-8">
                <FadeUp>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]
                           text-[#A8B0A0] mb-4 block">
                        COLLECTIONS
                    </span>

                    <h1 className="text-5xl font-black text-[#1E2020] leading-[1.1]
                         tracking-tight italic mb-4"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Your cafés.
                    </h1>
                </FadeUp>
            </div>

            <div className="px-5"><div className="h-px bg-[#D8DDD0]/60 mb-6" /></div>

            {/* ── TABS ──────────────────────────────────────────── */}
            <div className="px-5 flex gap-2 mb-8 relative z-10">
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[12px] font-bold transition-all ${activeTab === 'saved'
                        ? 'bg-[#0b4e9d] text-white shadow-[0_4px_14px_rgba(11,78,157,0.3)]'
                        : 'bg-white border border-[#EAEEE8] text-[#A8B0A0] hover:bg-[#F4F4F0]'
                        }`}
                >
                    Saved ({savedCafes.length})
                </button>
                <button
                    onClick={() => setActiveTab('visited')}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[12px] font-bold transition-all ${activeTab === 'visited'
                        ? 'bg-[#0b4e9d] text-white shadow-[0_4px_14px_rgba(11,78,157,0.3)]'
                        : 'bg-white border border-[#EAEEE8] text-[#A8B0A0] hover:bg-[#F4F4F0]'
                        }`}
                >
                    Visited ({visitedCafes.length})
                </button>
            </div>

            {/* ── CONTENT ────────────────────────────────────── */}
            <div className="px-5">
                <AnimatePresence mode="wait">
                    {activeTab === 'saved' ? (
                        <motion.div
                            key="tab-saved"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AnimatePresence mode="popLayout">
                                {savedCafes.length > 0 ? (
                                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {savedCafes.map((cafe, i) => (
                                            <motion.div
                                                key={cafe.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.92, y: 16 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.88, transition: { duration: 0.2 } }}
                                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                                className="relative group"
                                            >
                                                <CafeCard cafe={cafe} />

                                                {/* Unsave button overlay */}
                                                <button
                                                    onClick={() => toggleHeart(cafe.id)}
                                                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full
                                                       bg-white/90 backdrop-blur-sm flex items-center justify-center
                                                       border border-white/60
                                                       shadow-[0_2px_8px_rgba(0,0,0,0.12)]
                                                       hover:bg-red-50 hover:border-red-200
                                                       transition-all group/btn"
                                                    title="Remove from saved"
                                                >
                                                    <Heart
                                                        className="w-4 h-4 transition-colors fill-[#0b4e9d] text-[#0b4e9d]
                                                         group-hover/btn:fill-red-400 group-hover/btn:text-red-400"
                                                    />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    /* ── EMPTY STATE SAVED ──────────────── */
                                    <motion.div
                                        key="empty-saved"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-24 text-center"
                                    >
                                        <div className="w-20 h-20 rounded-3xl bg-[#EAF0FB] flex items-center justify-center mb-6">
                                            <BookmarkX className="w-9 h-9 text-[#0b4e9d]/40" />
                                        </div>
                                        <h3 className="text-xl font-black text-[#1E2020] mb-2 italic"
                                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                            No saved cafés.
                                        </h3>
                                        <p className="text-[14px] text-[#7A8478] max-w-[220px] leading-[1.8] mb-8">
                                            Tap ♥ on any café to save it for later.
                                        </p>
                                        <Link to="/search"
                                            className="inline-flex items-center gap-2 bg-[#0b4e9d] text-white
                                               text-[11px] font-black uppercase tracking-[0.14em]
                                               px-6 py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(11,78,157,0.35)]
                                               hover:bg-[#0a3d7a] transition-colors">
                                            Browse cafés
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="tab-visited"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <AnimatePresence mode="popLayout">
                                {visitedCafes.length > 0 ? (
                                    <motion.div layout className="flex flex-col gap-3">
                                        {visitedCafes.map((cafe, i) => (
                                            <motion.div
                                                key={`visited-${cafe.id}`}
                                                layout
                                                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                                className="flex items-center bg-white rounded-3xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-[#EAEAE6] gap-4"
                                            >
                                                <Link to={`/cafes/${cafe.id}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden flex-shrink-0 relative group">
                                                    <img src={cafe.photos[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={cafe.name} />
                                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                                                </Link>

                                                <div className="flex-1 min-w-0 py-1">
                                                    <Link to={`/cafes/${cafe.id}`}>
                                                        <h3 className="font-bold text-[15px] sm:text-[16px] truncate text-[#0b4e9d] italic leading-tight mb-1"
                                                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                                            {cafe.name}
                                                        </h3>
                                                    </Link>
                                                    <div className="text-[10px] sm:text-[11px] text-[#A8B0A0] truncate flex items-center gap-1 font-medium tracking-wide uppercase">
                                                        <MapPin className="w-3 h-3 flex-shrink-0" />
                                                        {cafe.area.split(',')[0]} <span className="mx-0.5 opacity-50">•</span> ₹{cafe.priceForTwo}
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {cafe.vibes.slice(0, 2).map(v => (
                                                            <span key={v} className="text-[9px] font-bold uppercase tracking-wider text-[#7A8478] bg-[#F0F2EC] px-2 py-0.5 rounded-full">
                                                                {v}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end justify-between self-stretch py-0.5 ml-auto">
                                                    <button onClick={() => removeVisited(cafe.id)} className="p-1.5 -mr-1.5 -mt-1 hover:bg-red-50 text-[#C8D0C0] hover:text-red-400 rounded-xl transition-colors">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <div className="text-[9px] sm:text-[10px] bg-[#EAF0FB] text-[#0b4e9d] px-2.5 py-1 rounded-xl font-bold tracking-wide border border-[#0b4e9d]/10 whitespace-nowrap hidden sm:block">
                                                        {getVisitDate(cafe.id)}
                                                    </div>
                                                    <div className="text-[9px] text-[#A8B0A0] font-bold block sm:hidden">
                                                        {getVisitDate(cafe.id)?.split(' ').slice(0, 2).join(' ')}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    /* ── EMPTY STATE VISITED ──────────────── */
                                    <motion.div
                                        key="empty-visited"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center justify-center py-24 text-center"
                                    >
                                        <div className="w-20 h-20 rounded-3xl bg-[#FEF4E8] border border-[#F5D9A8]/40 flex items-center justify-center mb-6">
                                            <Coffee className="w-9 h-9 text-[#B87A2A]/40" />
                                        </div>
                                        <h3 className="text-xl font-black text-[#1E2020] mb-2 italic"
                                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                            No visits logged yet.
                                        </h3>
                                        <p className="text-[14px] text-[#7A8478] max-w-[220px] leading-[1.8] mb-8">
                                            Keep track of where you've been. Mark cafés as visited.
                                        </p>
                                        <Link to="/search"
                                            className="inline-flex items-center gap-2 bg-[#0b4e9d] text-white
                                               text-[11px] font-black uppercase tracking-[0.14em]
                                               px-6 py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(11,78,157,0.35)]
                                               hover:bg-[#0a3d7a] transition-colors">
                                            Find a café
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── BOTTOM SUGGESTION ─────────────────────────────── */}
            {(savedCafes.length > 0 || visitedCafes.length > 0) && (
                <FadeUp delay={0.2}>
                    <div className="px-5 pt-10 pb-4">
                        <div className="h-px bg-[#D8DDD0]/60 mb-8" />
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em]
                               text-[#A8B0A0] mb-1">
                                    Not done exploring?
                                </p>
                                <p className="text-[14px] font-bold text-[#1E2020] italic"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    There's more out there.
                                </p>
                            </div>
                            <Link to="/search"
                                className="flex items-center gap-1.5 bg-[#0b4e9d] text-white
                               text-[11px] font-black uppercase tracking-[0.14em]
                               px-5 py-3 rounded-2xl shadow-[0_4px_14px_rgba(11,78,157,0.28)]
                               hover:bg-[#0a3d7a] transition-colors">
                                Find more
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </FadeUp>
            )}

        </div>
    );
};
