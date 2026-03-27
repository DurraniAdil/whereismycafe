import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, ArrowRight, Star } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';
import { Cafe } from '../types/cafe';

// WIMC Design Tokens
const ACCENT = '#4B9EF5';
const NAVY_DEEP = '#07152A';
const NAVY_BRAND = '#0b4e9d';

// Roulette Colors - curated palette
const WHEEL_COLORS = [
    '#0b4e9d', // Brand Blue
    '#083a75', // Darker Blue
    '#0d5dbb', // Lighter Blue
    '#062a54', // Deepest Blue
    '#1a6ecc', // Bright Blue
    '#041c38', // Near Black Blue
];

export const Roulette: React.FC<{ cafes: Cafe[] }> = ({ cafes }) => {
    const [mustSpin, setMustSpin] = useState(false);
    const [prizeNumber, setPrizeNumber] = useState(0);
    const [phase, setPhase] = useState<'idle' | 'spinning' | 'landed'>('idle');
    const [winner, setWinner] = useState<Cafe | null>(null);

    // Prepare data for the wheel
    const wheelData = useMemo(() => {
        return cafes.map(() => ({
            option: '',
            image: {
                uri: '/media/circle.png',
                sizeMultiplier: 0.1,
                offsetY: 200,
            },
            style: {
                fontSize: 0,
            }
        }));
    }, [cafes]);

    const handleSpin = useCallback(() => {
        if (mustSpin || cafes.length === 0) return;

        const newPrizeNumber = Math.floor(Math.random() * cafes.length);
        setPrizeNumber(newPrizeNumber);
        setMustSpin(true);
        setPhase('spinning');
        setWinner(null);
    }, [mustSpin, cafes]);

    const onStopSpinning = useCallback(() => {
        setMustSpin(false);
        setWinner(cafes[prizeNumber]);
        setPhase('landed');
    }, [cafes, prizeNumber]);

    const reset = useCallback(() => {
        setPhase('idle');
        setWinner(null);
        setMustSpin(false);
    }, []);

    if (cafes.length === 0) return null;

    // Detect desktop (lg breakpoint = 1024px)
    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
    );
    useEffect(() => {
        const mq = window.matchMedia('(min-width: 1024px)');
        const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
        setIsDesktop(mq.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    // Different marker positioning for mobile vs desktop
    const pointerProps = useMemo(() => {
        if (isDesktop) {
            return {
                src: '/media/marker.png',
                style: {
                    width: '65px',
                    height: 'auto',
                    right: '15px',
                    top: '0px',
                    transform: 'rotate(230deg)',
                } as React.CSSProperties,
            };
        }
        // Mobile — keep exactly as-is
        return {
            src: '/media/marker.png',
            style: {
                width: '100px',
                height: 'auto',
                right: '-20px',
                top: '-40px',
                transform: 'rotate(230deg)',
            } as React.CSSProperties,
        };
    }, [isDesktop]);

    return (
        <div className="w-full max-w-md lg:max-w-5xl mx-auto">
            {/* Section label */}
            <div className="flex items-center justify-between mb-4 px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
                    Café Roulette
                </p>
                <p className="text-[11px] text-[#A8B0A0] font-medium italic"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    feeling lucky?
                </p>
            </div>

            {/* Main Container */}
            <div className="bg-[#07152A] rounded-[2.5rem] overflow-hidden
                      shadow-[0_20px_50px_rgba(11,78,157,0.3)]
                      border border-[#0b4e9d]/20 relative
                      lg:flex lg:flex-row lg:min-h-[500px]">

                {/* ── WHEEL SECTION (left on desktop) ──────────── */}
                <div className="relative flex flex-col items-center pt-10 pb-6 overflow-hidden
                              lg:w-[55%] lg:flex-shrink-0 lg:pb-10 lg:justify-center">
                    {/* Background glow behind wheel */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 
                                  lg:w-96 lg:h-96
                                  bg-[#4B9EF5]/10 rounded-full blur-[80px] pointer-events-none" />

                    <div className="relative z-10 roulette-wheel-container scale-[0.85] sm:scale-100 lg:scale-110 transition-transform duration-500">
                        <Wheel
                            mustStartSpinning={mustSpin}
                            prizeNumber={prizeNumber}
                            data={wheelData}
                            onStopSpinning={onStopSpinning}
                            backgroundColors={WHEEL_COLORS}
                            textColors={['#FFFFFF']}
                            outerBorderColor={ACCENT}
                            outerBorderWidth={4}
                            innerBorderColor={NAVY_DEEP}
                            innerBorderWidth={15}
                            innerRadius={10}
                            radiusLineColor={`${ACCENT}30`}
                            radiusLineWidth={1}
                            fontSize={12}
                            textDistance={65}
                            spinDuration={0.6}
                            pointerProps={pointerProps}
                        />

                        {/* Custom Center Pin/Logo */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                                      w-12 h-12 bg-white rounded-full border-2 border-[#4B9EF5]
                                      flex items-center justify-center shadow-lg z-20 overflow-hidden">
                            <img src="/media/circle.png" alt="WIMC" className="w-15 h-15 object-contain" />
                        </div>
                    </div>
                </div>

                {/* ── RIGHT PANEL (controls + winner reveal) ───── */}
                <div className="lg:w-[45%] lg:flex lg:flex-col lg:justify-center lg:border-l lg:border-[#4B9EF5]/10">

                    {/* ── WINNER REVEAL ────────────────────────────── */}
                    <AnimatePresence>
                        {phase === 'landed' && winner && (
                            <motion.div
                                key="reveal"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.5, ease: [0.32, 0, 0.18, 1] }}
                                className="overflow-hidden bg-[#0a1d3a] lg:bg-transparent"
                            >
                                <div className="h-px w-full lg:hidden" style={{ background: 'linear-gradient(90deg, transparent, rgba(75,158,245,0.2) 50%, transparent)' }} />

                                {/* Winner Card */}
                                <div className="p-6">
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.4 }}
                                        className="relative rounded-3xl overflow-hidden h-40 lg:h-48 mb-5 group shadow-2xl"
                                    >
                                        <img src={winner.photos[0]} alt={winner.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#07152A] via-transparent to-transparent opacity-90" />

                                        {/* Selected Badge */}
                                        <div className="absolute top-4 left-4 bg-[#0b4e9d] text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xl border border-white/10">
                                            <Star size={10} className="fill-white" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Fate Decided</span>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.3, duration: 0.4 }}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4B9EF5] mb-1">
                                                    {winner.area.split(',')[0]}
                                                </p>
                                                <h3 className="text-2xl font-bold italic text-white leading-tight"
                                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                                    {winner.name}
                                                </h3>
                                            </div>
                                            <div className="bg-white/5 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/10 text-center">
                                                <p className="text-[10px] font-black text-white/40 uppercase leading-none mb-1">Price</p>
                                                <p className="text-sm font-bold text-white leading-none">₹{winner.priceForTwo}</p>
                                            </div>
                                        </div>

                                        {/* Vibes */}
                                        <div className="flex gap-2 mb-6 flex-wrap">
                                            {winner.vibes.slice(0, 3).map(v => (
                                                <span key={v} className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl border border-[#4B9EF5]/20 text-[#4B9EF5] bg-[#4B9EF5]/5">
                                                    {v}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3">
                                            <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 text-[11px] font-black uppercase tracking-[0.15em] py-4 rounded-2xl transition-all active:scale-95">
                                                <RefreshCw size={14} />
                                                Redo
                                            </button>
                                            <Link to={`/cafes/${winner.id}`} className="flex-[1.5] flex items-center justify-center gap-2 bg-[#0b4e9d] hover:bg-[#0d5dbb] text-white text-[11px] font-black uppercase tracking-[0.15em] py-4 rounded-2xl transition-all active:scale-95 shadow-[0_10px_25px_rgba(11,78,157,0.4)]">
                                                View Details
                                                <ArrowRight size={14} />
                                            </Link>
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── SPIN BUTTON ─────────────────────────────── */}
                    <AnimatePresence mode="wait">
                        {phase !== 'landed' && (
                            <motion.div
                                key="spin-btn"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                className="p-6 pt-0 lg:pt-6 lg:flex lg:flex-col lg:items-center lg:justify-center"
                            >
                                {/* Desktop-only headline */}
                                <div className="hidden lg:block text-center mb-8">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4B9EF5] mb-3">
                                        Can't decide?
                                    </p>
                                    <h3 className="text-3xl font-bold italic text-white leading-tight mb-2"
                                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                        Let fate decide
                                    </h3>
                                    <p className="text-sm text-white/40 font-medium">
                                        Spin the wheel and discover your next café adventure
                                    </p>
                                </div>

                                <button
                                    onClick={handleSpin}
                                    disabled={mustSpin}
                                    className={`w-full lg:max-w-xs flex items-center justify-center gap-3
                                    py-5 rounded-[1.5rem] font-black text-[12px]
                                    uppercase tracking-[0.25em] transition-all active:scale-[0.96] shadow-2xl
                                    ${mustSpin
                                            ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                                            : 'bg-white text-[#07152A] hover:bg-[#4B9EF5] hover:text-white transform hover:-translate-y-1'
                                        }`}
                                >
                                    <RefreshCw className={`w-4 h-4 ${mustSpin ? 'animate-spin' : ''}`} />
                                    {mustSpin ? 'The Wheel is Turning...' : 'Spin the Wheel'}
                                </button>
                                <p className="text-center text-[9px] font-bold text-white/20 uppercase tracking-[0.3em] mt-4">
                                    Handover your fate to the wheel
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
