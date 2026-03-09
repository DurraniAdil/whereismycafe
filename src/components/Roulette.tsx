import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, AnimatePresence } from 'motion/react';
import { RefreshCw, ArrowRight } from 'lucide-react';
import { Cafe } from '../types/cafe';

const ITEM_H = 62;
const VISIBLE = 5;
const CENTER = Math.floor(VISIBLE / 2);
const REPEATS = 14;

// Bright blue that's actually visible on the dark reel background
const ACCENT = '#4B9EF5';

export const Roulette: React.FC<{ cafes: Cafe[] }> = ({ cafes }) => {
    const [phase, setPhase] = useState<'idle' | 'spinning' | 'landed'>('idle');
    const [winnerTapeIdx, setWinnerTapeIdx] = useState(-1);
    const [winner, setWinner] = useState<Cafe | null>(null);
    const controls = useAnimation();

    const tape = Array.from({ length: REPEATS }, () => cafes).flat();

    const spin = useCallback(async () => {
        if (phase === 'spinning') return;

        const winnerCafe = cafes[Math.floor(Math.random() * cafes.length)];
        const cafeListIdx = cafes.findIndex(c => c.id === winnerCafe.id);
        const tapeIdx = Math.floor(REPEATS * 0.65) * cafes.length + cafeListIdx;

        setWinnerTapeIdx(tapeIdx);
        setWinner(winnerCafe);
        setPhase('spinning');

        const targetY = -(tapeIdx * ITEM_H) + CENTER * ITEM_H;

        await controls.set({ y: 0 });

        await controls.start({
            y: targetY - ITEM_H * 3,
            transition: { duration: 2.8, ease: [0.08, 0.92, 0.12, 1.0] },
        });

        await controls.start({
            y: targetY,
            transition: { type: 'spring', stiffness: 340, damping: 26, mass: 0.7 },
        });

        setPhase('landed');
    }, [cafes, controls, phase]);

    const reset = useCallback(async () => {
        setPhase('idle');
        setWinner(null);
        setWinnerTapeIdx(-1);
        await controls.set({ y: 0 });
    }, [controls]);

    return (
        <div>
            {/* Section label */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">
                    Café Roulette
                </p>
                <p className="text-[11px] text-[#A8B0A0] font-medium italic"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    feeling lucky?
                </p>
            </div>

            {/* Card — deep navy, not pure black */}
            <div className="bg-[#07152A] rounded-3xl overflow-hidden
                      shadow-[0_8px_40px_rgba(11,78,157,0.35)]
                      border border-[#0b4e9d]/20">

                {/* ── REEL WINDOW ─────────────────────────────── */}
                <div className="relative overflow-hidden select-none cursor-default"
                    style={{ height: VISIBLE * ITEM_H }}>

                    {/* Mist gradients */}
                    <div className="absolute inset-x-0 top-0 z-10 pointer-events-none"
                        style={{
                            height: ITEM_H * 2,
                            background: 'linear-gradient(to bottom, #07152A 15%, transparent)'
                        }} />
                    <div className="absolute inset-x-0 bottom-0 z-10 pointer-events-none"
                        style={{
                            height: ITEM_H * 2,
                            background: 'linear-gradient(to top, #07152A 15%, transparent)'
                        }} />

                    {/* Centre slot — blue tick lines */}
                    <div className="absolute inset-x-0 z-20 pointer-events-none"
                        style={{ top: CENTER * ITEM_H, height: ITEM_H }}>
                        <div className="absolute inset-x-0 top-0 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}66 25%, ${ACCENT}66 75%, transparent)` }} />
                        <div className="absolute inset-x-0 bottom-0 h-px"
                            style={{ background: `linear-gradient(90deg, transparent, ${ACCENT}66 25%, ${ACCENT}66 75%, transparent)` }} />
                        <div className="absolute inset-0 bg-white/[0.025]" />
                    </div>

                    {/* Side notches — brand blue */}
                    <div className="absolute left-0 z-30 flex items-center pointer-events-none"
                        style={{ top: CENTER * ITEM_H, height: ITEM_H }}>
                        <div className="w-[3px] h-5 rounded-r-full"
                            style={{ background: ACCENT, opacity: 0.7 }} />
                    </div>
                    <div className="absolute right-0 z-30 flex items-center pointer-events-none"
                        style={{ top: CENTER * ITEM_H, height: ITEM_H }}>
                        <div className="w-[3px] h-5 rounded-l-full"
                            style={{ background: ACCENT, opacity: 0.7 }} />
                    </div>

                    {/* THE TAPE */}
                    <motion.div animate={controls} style={{ y: 0 }}>
                        {tape.map((cafe, i) => {
                            const isWinner = phase === 'landed' && i === winnerTapeIdx;
                            return (
                                <div key={`${cafe.id}-${i}`}
                                    style={{ height: ITEM_H }}
                                    className="flex items-center gap-3 px-6">

                                    {/* Dot */}
                                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                                   transition-all duration-300
                                   ${isWinner ? 'scale-[1.4]' : 'bg-white/10 scale-100'}`}
                                        style={isWinner ? { background: ACCENT } : {}} />

                                    {/* Name */}
                                    <p className={`flex-1 italic truncate transition-all duration-300
                                 ${isWinner
                                            ? 'font-bold text-[16px]'
                                            : 'text-white/30 font-semibold text-[13px]'}`}
                                        style={{
                                            fontFamily: "'Playfair Display', Georgia, serif",
                                            ...(isWinner ? { color: '#FFFFFF' } : {}),
                                        }}>
                                        {cafe.name}
                                    </p>

                                    {/* Price */}
                                    <p className={`text-[11px] tabular-nums flex-shrink-0 transition-colors duration-300
                                 ${isWinner ? 'font-bold' : 'text-white/18 font-medium'}`}
                                        style={isWinner ? { color: ACCENT } : {}}>
                                        ₹{cafe.priceForTwo}
                                    </p>
                                </div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* ── WINNER REVEAL ────────────────────────────── */}
                <AnimatePresence>
                    {phase === 'landed' && winner && (
                        <motion.div
                            key="reveal"
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.48, ease: [0.32, 0, 0.18, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="h-px mx-5"
                                style={{ background: 'rgba(75,158,245,0.15)' }} />

                            {/* Photo */}
                            <motion.div className="relative h-44 overflow-hidden"
                                initial={{ scale: 1.08, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.18, duration: 0.65, ease: 'easeOut' }}>
                                <img src={winner.photos[0]} alt={winner.name}
                                    className="w-full h-full object-cover" />
                                <div className="absolute inset-0"
                                    style={{ background: 'linear-gradient(to top, #07152A 0%, rgba(7,21,42,0.2) 55%, transparent)' }} />

                                {/* Badge — brand blue */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: -6 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ delay: 0.42, type: 'spring', stiffness: 500, damping: 22 }}
                                    className="absolute top-3 left-3 text-white rounded-full
                             px-3 py-1 flex items-center gap-1.5
                             shadow-[0_2px_12px_rgba(11,78,157,0.5)]"
                                    style={{ background: '#0b4e9d' }}>
                                    <span className="w-1 h-1 rounded-full bg-white/40" />
                                    <span className="text-[9px] font-black uppercase tracking-[0.18em]">
                                        Tonight's pick
                                    </span>
                                </motion.div>
                            </motion.div>

                            {/* Info */}
                            <motion.div className="px-5 pt-4 pb-5"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.4 }}>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em]
                              text-white/30 mb-1">
                                    {winner.area.replace(', Aurangabad', '')}
                                </p>
                                <h3 className="text-[22px] font-bold italic text-white leading-tight"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    {winner.name}
                                </h3>
                                <p className="text-white/30 text-xs font-medium mt-1.5">
                                    ₹{winner.priceForTwo} for two
                                </p>

                                {/* Vibe pills — blue tinted */}
                                <div className="flex gap-1.5 mt-3 flex-wrap">
                                    {winner.vibes.slice(0, 3).map(v => (
                                        <span key={v}
                                            className="text-[9px] font-black uppercase tracking-wider
                                 px-2.5 py-1 rounded-full"
                                            style={{
                                                color: ACCENT,
                                                border: `1px solid ${ACCENT}30`,
                                                background: `${ACCENT}10`
                                            }}>
                                            {v}
                                        </span>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <motion.div className="flex gap-2.5 mt-4"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.48 }}>

                                    <button onClick={reset}
                                        className="flex-1 flex items-center justify-center gap-2
                               border text-white/60 text-[11px] font-bold
                               uppercase tracking-wider py-3 rounded-2xl
                               transition-all active:scale-95
                               hover:border-white/20 hover:text-white/80"
                                        style={{
                                            background: 'rgba(75,158,245,0.06)',
                                            borderColor: 'rgba(75,158,245,0.15)'
                                        }}>
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Again
                                    </button>

                                    <Link to={`/cafes/${winner.id}`}
                                        className="flex-1 flex items-center justify-center gap-2
                               text-white text-[11px] font-black
                               uppercase tracking-wider py-3 rounded-2xl
                               transition-all active:scale-95
                               shadow-[0_4px_14px_rgba(11,78,157,0.45)]
                               hover:brightness-110"
                                        style={{ background: '#0b4e9d' }}>
                                        Let's go
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </motion.div>
                            </motion.div>
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
                            exit={{ opacity: 0, transition: { duration: 0.15 } }}
                            className="px-5 pb-5 pt-3"
                        >
                            <button
                                onClick={spin}
                                disabled={phase === 'spinning'}
                                className={`w-full flex items-center justify-center gap-2.5
                            py-4 rounded-2xl font-black text-[11px]
                            uppercase tracking-[0.18em] transition-all active:scale-[0.97]
                            ${phase === 'spinning'
                                        ? 'cursor-not-allowed'
                                        : 'shadow-[0_4px_18px_rgba(11,78,157,0.4)] hover:brightness-110'
                                    }`}
                                style={phase === 'spinning'
                                    ? { background: 'rgba(75,158,245,0.08)', color: 'rgba(255,255,255,0.2)' }
                                    : { background: '#0b4e9d', color: '#ffffff' }
                                }>
                                <RefreshCw className={`w-4 h-4 ${phase === 'spinning' ? 'animate-spin' : ''}`} />
                                {phase === 'spinning' ? 'Finding your café...' : 'Spin the wheel'}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};
