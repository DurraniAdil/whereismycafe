import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Sparkles, Info, MapPin, Menu as MenuIcon, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type NavItem = {
    icon: any;
    label: string;
    href?: string;
    isAction?: boolean;
};

const navItems: NavItem[] = [
    { icon: MenuIcon, label: 'Menu', isAction: true },
    { icon: MapPin, label: 'Map', href: '/map' },
    { icon: Sparkles, label: 'Vibes', href: '/' },
    { icon: Search, label: 'Search', href: '/search' },
    { icon: User, label: 'Profile', href: '/profile' },
];

export const DesktopMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuDropdownOpen, setIsMenuDropdownOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setIsMenuDropdownOpen(false);
            }
        };
        if (isOpen || isMenuDropdownOpen) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, isMenuDropdownOpen]);

    useEffect(() => {
        setIsOpen(false);
        setIsMenuDropdownOpen(false);
    }, [location.pathname]);

    return (
        <div ref={menuRef} className="hidden md:flex items-center justify-end gap-2">

            <div className="flex flex-col gap-1">
                <Link
                    to="/about"
                    onClick={() => setIsMenuDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white hover:bg-[#EAF0FB] border border-transparent hover:border-[#E8EDF8] group transition-all"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#F8F7F4] flex items-center justify-center group-hover:bg-white text-[#B8C0C8] group-hover:text-[#0b4e9d] transition-colors shadow-sm">
                        <Info className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-[#1E2020] tracking-wide">About Us</span>
                </Link>

                <Link
                    to="/studio"
                    onClick={() => setIsMenuDropdownOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white hover:bg-[#EAF0FB] border border-transparent hover:border-[#E8EDF8] group transition-all"
                >
                    <div className="w-10 h-10 rounded-xl bg-[#F8F7F4] flex items-center justify-center group-hover:bg-white text-[#B8C0C8] group-hover:text-[#0b4e9d] transition-colors shadow-sm">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-[#1E2020] tracking-wide">WIMC Studio</span>
                </Link>
            </div>

            {/* ── Divider ───────────────────────────────────────── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scaleY: 0 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        exit={{ opacity: 0, scaleY: 0 }}
                        transition={{ duration: 0.2 }}
                        className="w-px h-6 bg-[#D8DDD0] origin-center"
                    />
                )}
            </AnimatePresence>

            {/* ── Logo trigger ──────────────────────────────────── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                className={`relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0
                    transition-all duration-300 focus:outline-none
                    ${isOpen
                        // open: blue ring
                        ? 'ring-2 ring-[#0b4e9d]/40 ring-offset-2 ring-offset-[#F8F6F1] scale-[0.97]'
                        // idle: soft shadow + scale
                        : 'shadow-[0_2px_10px_rgba(11,78,157,0.15)] hover:scale-[1.06] hover:shadow-[0_4px_18px_rgba(11,78,157,0.28)]'
                    }`}
            >
                <img
                    src={`${import.meta.env.BASE_URL}media/circle.png`}
                    alt="Menu"
                    className="w-full h-full object-cover"
                />

                {/* Blue tint overlay when open */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0b4e9d]/12 rounded-full"
                        />
                    )}
                </AnimatePresence>
            </button>

        </div>
    );
};
