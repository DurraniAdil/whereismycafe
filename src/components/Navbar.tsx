import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, MapPin, Menu, X, Info, BookMarked } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

type NavItem = {
  icon: any;
  label: string;
  href?: string;
  isAction?: boolean;
};

const navItems: NavItem[] = [
  { icon: Menu, label: 'Menu', isAction: true },
  { icon: MapPin, label: 'Map', href: '/map' },
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Heart, label: 'Vibes', href: '/vibes' },
];

export const Navbar: React.FC = () => {
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-[51] md:hidden
                      bg-white/90 backdrop-blur-md
                      border-t border-[#E8EDF8]/80
                      pb-safe pt-2 px-2">
        <div className="flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = item.href ? pathname === item.href : isMenuOpen && item.isAction;
            const Icon = item.icon;

            const content = (
              <>
                {/* Active background pill */}
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute inset-x-2 top-0 bottom-0 rounded-2xl
                               bg-[#0b4e9d]/8"
                  />
                )}

                {/* Icon */}
                <span className={cn(
                  'relative z-10 flex items-center justify-center w-6 h-6 mb-1',
                  'transition-colors duration-200',
                  isActive ? 'text-[#0b4e9d]' : 'text-[#B8C0C8]'
                )}>
                  <Icon
                    className="w-[22px] h-[22px]"
                    strokeWidth={isActive ? 2.5 : 1.8}
                    fill={isActive ? 'rgba(11,78,157,0.12)' : 'none'}
                  />
                </span>

                {/* Label */}
                <span className={cn(
                  'relative z-10 text-[10px] font-bold uppercase tracking-[0.1em]',
                  'transition-colors duration-200',
                  isActive ? 'text-[#0b4e9d]' : 'text-[#B8C0C8]'
                )}>
                  {item.label}
                </span>

                {/* Active dot below label */}
                {isActive && (
                  <motion.span
                    layoutId="nav-dot"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    className="absolute -bottom-px w-4 h-[2.5px] rounded-full bg-[#0b4e9d]"
                  />
                )}
              </>
            );

            if (item.isAction) {
              return (
                <button
                  key={item.label}
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="relative flex flex-col items-center flex-1 py-1 focus:outline-none"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.href!}
                onClick={() => setIsMenuOpen(false)}
                className="relative flex flex-col items-center flex-1 py-1 focus:outline-none"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Slide-above Menu Sheet */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60, transition: { duration: 0.18, ease: "easeIn" } }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="fixed bottom-[66px] left-3 right-3 z-[52] md:hidden
                         bg-[#0b4e9d] rounded-2xl shadow-[0_-4px_24px_rgba(11,78,157,0.35)]
                         overflow-hidden"
            >
              <div className="px-4 py-3">
                {/* Header row */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/50">
                    More
                  </span>
                  <button onClick={() => setIsMenuOpen(false)}
                    className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center 
                               text-white/70 active:bg-white/20 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Menu items */}
                <div className="flex flex-col gap-1">
                  <Link to="/about"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                               bg-white/10 active:bg-white/20 transition-colors"
                  >
                    <Info className="w-4 h-4 text-white/70" />
                    <span className="text-[13px] font-bold text-white tracking-wide">
                      About Us
                    </span>
                  </Link>

                  <div className="h-px mx-3" />

                  <Link to="/collections"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                               bg-white/10 active:bg-white/20 transition-colors"
                  >
                    <BookMarked className="w-4 h-4 text-white/70" />
                    <span className="text-[13px] font-bold text-white tracking-wide">
                      Collections
                    </span>
                  </Link>

                  <div className="h-px mx-3" />

                  <Link to="/studio"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                               bg-white/10 active:bg-white/20 transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-white/70" />
                    <span className="text-[13px] font-bold text-white tracking-wide">
                      WIMC Studio
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
