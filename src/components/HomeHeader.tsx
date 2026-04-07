import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sparkles, MapPin, Menu as MenuIcon, Info, User, MessageSquare, CalendarDays } from 'lucide-react';
import { getAllCafes } from '../lib/getCafes';
import { Cafe, Vibe } from '../types/cafe';
import { useLogoClick } from '../hooks/useLogoClick';
import { useAuth } from '../context/AuthContext';

type NavItem = {
    icon: any;
    label: string;
    href: string;
};

// Stage 1: shown when logo is clicked
const primaryNavItems: NavItem[] = [
    { icon: MapPin, label: 'Map', href: '/map' },
    { icon: Sparkles, label: 'Vibes', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: User, label: 'Profile', href: '/profile' },
];

// Stage 2: shown when Menu button is clicked (slides further left)
const secondaryNavItems: NavItem[] = [
    { icon: Info, label: 'About', href: '/about' },
    { icon: MessageSquare, label: 'Contact', href: '/contact' },
    { icon: CalendarDays, label: 'Trip Planner', href: '/trip' },
];

function getGreeting() {
    const h = new Date().getHours();
    if (h < 5) return { text: 'Still up?', sub: 'Only the brave and the caffeinated.' };
    if (h < 12) return { text: 'Good morning', sub: 'Find your first cup of the day.' };
    if (h < 17) return { text: 'Good afternoon', sub: 'Beat the slump. Find a café.' };
    if (h < 20) return { text: 'Good evening', sub: 'Perfect time to sit, sip, and chill.' };
    return { text: 'Night owl?', sub: 'Some of these are open late.' };
}

const VIBES: { label: Vibe; hover: string }[] = [
    { label: 'Study', hover: 'hover:bg-[#2D6A4F] hover:text-white hover:border-[#2D6A4F]' },
    { label: 'Chill', hover: 'hover:bg-[#0b4e9d] hover:text-white hover:border-[#0b4e9d]' },
    { label: 'Date', hover: 'hover:bg-[#C0392B] hover:text-white hover:border-[#C0392B]' },
    { label: 'Party', hover: 'hover:bg-[#D4A017] hover:text-white hover:border-[#D4A017]' },
    { label: 'Work', hover: 'hover:bg-[#0b4e9d] hover:text-white hover:border-[#0b4e9d]' },
    { label: 'Me Time', hover: 'hover:bg-[#8B5E3C] hover:text-white hover:border-[#8B5E3C]' },
];

const MARQUEE_ITEMS = [
    'Coffea Sambhajinagar', 'Two Stories Cafe', 'Neem Chhav Cafe',
    'The Golden Hour', 'Chéri Cafe', 'Royal Cafe',
    'Kelvin 77', 'Cafe AK47', 'Omnific Caff',
    "Chai Maker's Cafe", 'Sky Cafe', 'Cafe With Environment',
];

interface HomeHeaderProps {
    onVibeSelect: (vibe: Vibe) => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({ onVibeSelect }) => {
    const greeting = getGreeting();
    const [allCafes, setAllCafes] = useState<Cafe[]>([]);

    useEffect(() => {
        getAllCafes()
          .then(setAllCafes)
          .catch(err => console.error("HomeHeader failed to fetch cafes:", err));
    }, []);

    const trendingCount = allCafes.filter(c => c.isTrending).length;
    const handleLogoClick = useLogoClick();
    const { isAuthenticated, setShowAuthModal } = useAuth();

    const handleProtectedLink = (e: React.MouseEvent, href: string) => {
        if ((href === '/profile' || href === '/trip') && !isAuthenticated) {
            e.preventDefault();
            setShowAuthModal(true);
        }
    };

    const [isMenuOpen, setIsMenuOpen] = useState(false);        // stage 1: logo clicked
    const [isMenuExpanded, setIsMenuExpanded] = useState(false); // stage 2: Menu pill clicked
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsMenuOpen(false);
                setIsMenuExpanded(false);
            }
        };
        if (isMenuOpen || isMenuExpanded) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isMenuOpen, isMenuExpanded]);

    useEffect(() => {
        setIsMenuOpen(false);
        setIsMenuExpanded(false);
    }, [location.pathname]);

    return (
        <div className="relative overflow-hidden bg-[#F8F6F1]">

            {/* ── Main content ────────────────────────────────── */}
            <div className="relative z-10 px-5 pt-10 pb-2">

                {/* Top row */}
                <div className="flex items-start justify-between mb-7">

                    {/* Left — greeting + title */}
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Greeting pill */}
                        <div className="inline-flex items-center gap-2 bg-white/80 border border-[#E4E7DF]
                            rounded-full px-3.5 py-1.5 mb-4 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6B8C5A] animate-pulse" />
                            <span className="text-[11px] font-semibold text-[#7A8478]">
                                {greeting.text}
                            </span>
                        </div>

                        {/* Title — Playfair */}
                        <h1 className="text-4xl font-black text-[#1E2020] tracking-tight leading-none mb-2"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            Where Is<br />
                            <span className="relative">
                                My Cafe?
                                {/* Squiggle — brand blue */}
                                <svg className="absolute -bottom-1.5 left-0 w-full"
                                    viewBox="0 0 200 8" preserveAspectRatio="none"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <motion.path
                                        d="M0,5 Q25,1 50,5 Q75,9 100,5 Q125,1 150,5 Q175,9 200,5"
                                        fill="none"
                                        stroke="#0b4e9d"
                                        strokeWidth="2.5"
                                        strokeLinecap="round"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                                    />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-sm text-[#7A8478] mt-3 font-medium italic"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {greeting.sub}
                        </p>
                    </motion.div>

                    {/* Right — desktop nav + logo */}
                    <div className="flex items-center justify-end gap-2" ref={menuRef}>

                        <div className="hidden md:flex items-center gap-2 z-20">

                            {/* Stage 2: secondary items (About, etc.) — shown when Menu is clicked */}
                            <AnimatePresence>
                                {isMenuExpanded && secondaryNavItems.map((item, i) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.href;
                                    const delay = (secondaryNavItems.length - 1 - i) * 0.07;

                                    return (
                                        <motion.div
                                            key={item.label}
                                            initial={{ opacity: 0, x: 32, scale: 0.85 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: 32, scale: 0.85 }}
                                            transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <Link
                                                to={item.href}
                                                onClick={(e) => handleProtectedLink(e, item.href)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap focus:outline-none ${isActive
                                                    ? 'bg-[#0b4e9d] border-[#0b4e9d] text-white shadow-[0_4px_16px_rgba(11,78,157,0.35)]'
                                                    : 'bg-white border-[#D8DDD0] text-[#1E2020] hover:bg-[#EBF1FB] hover:border-[#0b4e9d]/25'
                                                    }`}
                                            >
                                                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#7A8478]'}`} />
                                                <span className="text-sm font-bold tracking-[-0.01em]">{item.label}</span>
                                                {isActive && <span className="w-1 h-1 rounded-full bg-white/60 ml-0.5" />}
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {/* Stage 1: Menu button + primary items (Vibes, Map, Search) — shown when logo is clicked */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <>
                                        {/* Menu toggle button */}
                                        <motion.div
                                            key="menu-btn"
                                            initial={{ opacity: 0, x: 32, scale: 0.85 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: 32, scale: 0.85 }}
                                            transition={{ duration: 0.35, delay: (primaryNavItems.length) * 0.07, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <button
                                                onClick={() => setIsMenuExpanded(!isMenuExpanded)}
                                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap focus:outline-none ${isMenuExpanded
                                                    ? 'bg-[#0b4e9d] border-[#0b4e9d] text-white shadow-[0_4px_16px_rgba(11,78,157,0.35)]'
                                                    : 'bg-white border-[#D8DDD0] text-[#1E2020] hover:bg-[#EBF1FB] hover:border-[#0b4e9d]/25'
                                                    }`}
                                            >
                                                <MenuIcon className={`w-3.5 h-3.5 flex-shrink-0 ${isMenuExpanded ? 'text-white' : 'text-[#7A8478]'}`} />
                                                <span className="text-sm font-bold tracking-[-0.01em]">Menu</span>
                                                {isMenuExpanded && <span className="w-1 h-1 rounded-full bg-white/60 ml-0.5" />}
                                            </button>
                                        </motion.div>

                                        {/* Primary nav items */}
                                        {primaryNavItems.map((item, i) => {
                                            const Icon = item.icon;
                                            const isActive = location.pathname === item.href;
                                            const delay = (primaryNavItems.length - 1 - i) * 0.07;

                                            return (
                                                <motion.div
                                                    key={item.label}
                                                    initial={{ opacity: 0, x: 32, scale: 0.85 }}
                                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                                    exit={{ opacity: 0, x: 32, scale: 0.85 }}
                                                    transition={{ duration: 0.35, delay, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                    <Link
                                                        to={item.href}
                                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-200 whitespace-nowrap focus:outline-none ${isActive
                                                            ? 'bg-[#0b4e9d] border-[#0b4e9d] text-white shadow-[0_4px_16px_rgba(11,78,157,0.35)]'
                                                            : 'bg-white border-[#D8DDD0] text-[#1E2020] hover:bg-[#EBF1FB] hover:border-[#0b4e9d]/25'
                                                            }`}
                                                    >
                                                        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#7A8478]'}`} />
                                                        <span className="text-sm font-bold tracking-[-0.01em]">{item.label}</span>
                                                        {isActive && <span className="w-1 h-1 rounded-full bg-white/60 ml-0.5" />}
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </>
                                )}
                            </AnimatePresence>

                            {/* Divider */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, scaleY: 0 }}
                                        animate={{ opacity: 1, scaleY: 1 }}
                                        exit={{ opacity: 0, scaleY: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="w-px h-10 bg-[#D8DDD0] origin-center mr-2"
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="relative z-30"
                        >
                            <img
                                src={`${import.meta.env.BASE_URL}media/circle.png`}
                                alt="logo"
                                onClick={() => {
                                    if (window.innerWidth < 768) handleLogoClick();
                                    else {
                                        const next = !isMenuOpen;
                                        setIsMenuOpen(next);
                                        if (!next) setIsMenuExpanded(false);
                                    }
                                }}
                                className={`w-40 h-40 rounded-full object-cover cursor-pointer
                            border-2 border-white transition-all duration-300
                            shadow-[0_4px_18px_rgba(11,78,157,0.18)]
                            ${isMenuOpen
                                        // open: brand blue ring
                                        ? 'ring-4 ring-[#0b4e9d]/25 ring-offset-4 ring-offset-[#F8F6F1] scale-[0.97]'
                                        : 'hover:scale-105 hover:shadow-[0_6px_24px_rgba(11,78,157,0.28)]'
                                    }`}
                            />
                        </motion.div>
                    </div>
                </div>


                {/* ── Vibe section label ─────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3 mb-3"
                >
                    <p className="text-[10px] font-bold text-[#A8B0A0] uppercase tracking-[0.2em]">
                        What's the vibe?
                    </p>
                    <div className="flex-1 h-px bg-[#E4E7DF]" />
                </motion.div>
            </div>

            {/* ── Vibe pills ────────────────────────────────────── */}
            <div className="relative z-10 px-5 mb-8">
                <div className="grid grid-cols-3 gap-2.5 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
                    {VIBES.map(({ label, hover }, i) => (
                        <motion.button
                            key={label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: 0.4 + i * 0.05 }}
                            onClick={() => onVibeSelect(label)}
                            className={`py-3 sm:px-6 rounded-2xl bg-white border border-[#E4E7DF]
                          text-xs font-black uppercase tracking-wider text-[#1E2020]
                          shadow-sm active:scale-95 transition-all duration-200 ${hover}`}
                        >
                            {label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ── Marquee strip — brand blue ─────────────────────── */}
            <div className="relative z-10 overflow-hidden border-y border-[#0b4e9d]/30
                      bg-[#0b4e9d] py-2.5 mb-6">
                <motion.div
                    className="flex gap-8 whitespace-nowrap"
                    animate={{ x: ['0%', '-50%'] }}
                    transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                >
                    {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
                        <span key={i} className="text-[11px] font-semibold text-white/75 flex-shrink-0
                                     uppercase tracking-[0.12em]">
                            {item}
                            <span className="ml-8 text-white/25">·</span>
                        </span>
                    ))}
                </motion.div>
            </div>

        </div>
    );
};
