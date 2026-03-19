import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RotateCcw, Coffee, Sparkles, Heart, Moon,
    Sun, Wind, Flame, MapPin, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cafe, Vibe } from '../types/cafe';

// ─── Flap colours ────────────────────────────────────────────────────────────
const COLORS = [
    { bg: '#E4EEF9', hover: '#BDD4F2', text: '#1a4fcc', crease: '#c9daf0' }, // blue   – top
    { bg: '#FEF0E6', hover: '#FAD1A8', text: '#b84c15', crease: '#f5d8b8' }, // orange – right
    { bg: '#E5F7EE', hover: '#AEECCE', text: '#1a5e3a', crease: '#c1e9d4' }, // green  – bottom
    { bg: '#EFE9FC', hover: '#CFBAEE', text: '#6528a8', crease: '#daccf0' }, // purple – left
] as const;

// ─── Geometry + fold-axis per flap ──────────────────────────────────────────
const FLAP_CFG = [
    {
        clip: 'polygon(0% 0%, 100% 0%, 50% 50%)',
        lTop: '21%', lLeft: '50%', lRot: 0,
        fAxis: 'rotateX' as const, fDeg: 90,
    },
    {
        clip: 'polygon(100% 0%, 100% 100%, 50% 50%)',
        lTop: '50%', lLeft: '79%', lRot: 90,
        fAxis: 'rotateY' as const, fDeg: -90,
    },
    {
        clip: 'polygon(100% 100%, 0% 100%, 50% 50%)',
        lTop: '79%', lLeft: '50%', lRot: 180,
        fAxis: 'rotateX' as const, fDeg: -90,
    },
    {
        clip: 'polygon(0% 100%, 0% 0%, 50% 50%)',
        lTop: '50%', lLeft: '21%', lRot: -90,
        fAxis: 'rotateY' as const, fDeg: 90,
    },
] as const;

// ─── Questions ───────────────────────────────────────────────────────────────
const QUESTIONS = [
    {
        q: "What's the plan?", round: '01 / 03',
        options: [
            { label: 'Work', sub: 'Heads down', vibes: ['Work', 'Study'] as Vibe[], icon: Sparkles },
            { label: 'Date', sub: 'Just us two', vibes: ['Date'] as Vibe[], icon: Heart },
            { label: 'Chill', sub: 'No agenda', vibes: ['Chill'] as Vibe[], icon: Coffee },
            { label: 'Squad', sub: 'The gang', vibes: ['Party', 'Chill'] as Vibe[], icon: Flame },
        ],
    },
    {
        q: 'What energy?', round: '02 / 03',
        options: [
            { label: 'Quiet', sub: 'Pin-drop', vibes: ['Study'] as Vibe[], icon: Moon },
            { label: 'Buzz', sub: 'Lively', vibes: ['Work'] as Vibe[], icon: Sun },
            { label: 'Vibe', sub: 'Soft murmur', vibes: ['Chill'] as Vibe[], icon: Wind },
            { label: 'Loud', sub: 'Full send', vibes: ['Party'] as Vibe[], icon: Flame },
        ],
    },
    {
        q: 'Budget?', round: '03 / 03',
        options: [
            { label: 'Easy', sub: 'Under ₹300', vibes: [] as Vibe[], maxPrice: 300, icon: Coffee },
            { label: 'Mid', sub: 'Under ₹600', vibes: [] as Vibe[], maxPrice: 600, icon: Sun },
            { label: 'Fancy', sub: '₹1000 max', vibes: [] as Vibe[], maxPrice: 1000, icon: Heart },
            { label: 'Open', sub: 'No limit', vibes: [] as Vibe[], maxPrice: 99999, icon: Sparkles },
        ],
    },
];

// ─── Single triangular flap ──────────────────────────────────────────────────
const Flap: React.FC<{
    opt: typeof QUESTIONS[0]['options'][0];
    index: number;
    isPicked: boolean;
    disabled: boolean;
    onPick: () => void;
}> = ({ opt, index, isPicked, disabled, onPick }) => {
    const cfg = FLAP_CFG[index];
    const color = COLORS[index];
    const Icon = opt.icon;

    // Build the fold-out animate target safely
    const foldTarget = cfg.fAxis === 'rotateX'
        ? { rotateX: cfg.fDeg, rotateY: 0, opacity: 0, backgroundColor: color.hover }
        : { rotateX: 0, rotateY: cfg.fDeg, opacity: 0, backgroundColor: color.hover };

    const idleTarget = { rotateX: 0, rotateY: 0, opacity: 1, backgroundColor: color.bg };

    return (
        <motion.button
            onClick={onPick}
            disabled={disabled}
            aria-label={opt.label}
            style={{
                position: 'absolute',
                inset: 0,
                clipPath: cfg.clip,
                transformOrigin: 'center center',
                cursor: disabled ? 'default' : 'pointer',
                border: 'none',
                padding: 0,
                WebkitTapHighlightColor: 'transparent',
            }}
            initial={idleTarget}
            animate={isPicked ? foldTarget : idleTarget}
            whileHover={!disabled ? { backgroundColor: color.hover } : undefined}
            transition={{ type: 'spring', stiffness: 230, damping: 26 }}
        >
            {/* Paper sheen – top-left catch-light */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.45) 0%, transparent 52%)',
            }} />

            {/* Subtle paper grain (thin repeating diagonal) */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.18,
                backgroundImage:
                    'repeating-linear-gradient(45deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 6px)',
            }} />

            {/* Label block */}
            <div style={{
                position: 'absolute',
                top: cfg.lTop,
                left: cfg.lLeft,
                transform: `translate(-50%, -50%) rotate(${cfg.lRot}deg)`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                pointerEvents: 'none',
                userSelect: 'none',
            }}>
                <Icon style={{ width: 15, height: 15, color: color.text }} />
                <span style={{
                    fontSize: 9.5,
                    fontWeight: 700,
                    color: color.text,
                    fontFamily: "'DM Mono', 'Courier New', monospace",
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                }}>
                    {opt.label}
                </span>
                <span style={{
                    fontSize: 7.5,
                    color: color.text + 'aa',
                    fontFamily: "'DM Mono', 'Courier New', monospace",
                    whiteSpace: 'nowrap',
                }}>
                    {opt.sub}
                </span>
            </div>
        </motion.button>
    );
};

// ─── The 3-D paper fortune teller ────────────────────────────────────────────
const FortuneTeller: React.FC<{
    step: number;
    options: typeof QUESTIONS[0]['options'];
    picked: string | null;
    onPick: (opt: typeof QUESTIONS[0]['options'][0]) => void;
}> = ({ step, options, picked, onPick }) => (
    <div style={{ perspective: 680, perspectiveOrigin: '50% 4%' }}>
        <AnimatePresence mode="wait">
            <motion.div
                key={`ft-${step}`}
                style={{
                    width: 264, height: 264,
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    // Cast a nice table-shadow
                    filter: 'drop-shadow(0 20px 48px rgba(0,0,0,0.24)) drop-shadow(0 4px 10px rgba(0,0,0,0.12))',
                }}
                initial={{ rotateX: 36, rotateY: 16, scale: 0.68, opacity: 0 }}
                animate={{ rotateX: 22, rotateY: -5, scale: 1, opacity: 1 }}
                exit={{ rotateX: 36, rotateY: -16, scale: 0.68, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            >
                {/* ── Crease-line base layer (visible between flaps) ── */}
                <div style={{ position: 'absolute', inset: 0, background: '#c0c6d0' }} />

                {/* ── 4 coloured flaps ── */}
                {options.map((opt, i) => (
                    <Flap
                        key={opt.label}
                        opt={opt}
                        index={i}
                        isPicked={picked === opt.label}
                        disabled={picked !== null}
                        onPick={() => onPick(opt)}
                    />
                ))}

                {/* ── SVG overlay: fold creases + corner pockets + center pin ── */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10 }}>
                    <svg width="264" height="264" style={{ overflow: 'visible' }}>
                        {/* Diagonal fold creases (the defining feature of a fortune teller) */}
                        <line x1="0" y1="0" x2="264" y2="264" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
                        <line x1="264" y1="0" x2="0" y2="264" stroke="white" strokeWidth="3.5" strokeLinecap="round" />

                        {/* Outer border */}
                        <rect x="0.5" y="0.5" width="263" height="263"
                            fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.5" />

                        {/* Corner pocket shadows – hint at the folded paper corners */}
                        <polygon points="0,0 28,0 0,28" fill="rgba(0,0,0,0.09)" />
                        <polygon points="264,0 236,0 264,28" fill="rgba(0,0,0,0.09)" />
                        <polygon points="264,264 236,264 264,236" fill="rgba(0,0,0,0.09)" />
                        <polygon points="0,264 28,264 0,236" fill="rgba(0,0,0,0.09)" />

                        {/* Outer corner fold lines (the diagonal creases at each pocket) */}
                        <line x1="0" y1="0" x2="28" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                        <line x1="264" y1="0" x2="236" y2="28" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                        <line x1="264" y1="264" x2="236" y2="236" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
                        <line x1="0" y1="264" x2="28" y2="236" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />

                        {/* Center pin */}
                        <circle cx="132" cy="132" r="16" fill="white" />
                        <circle cx="132" cy="132" r="9" fill="#bec5ce" />
                        <circle cx="132" cy="132" r="4.5" fill="white" />
                        <circle cx="132" cy="132" r="2" fill="#bec5ce" />
                    </svg>
                </div>
            </motion.div>
        </AnimatePresence>
    </div>
);

// ─── Main export ─────────────────────────────────────────────────────────────
export const MoodPicker: React.FC<{ cafes: Cafe[] }> = ({ cafes }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<typeof QUESTIONS[0]['options'][0][]>([]);
    const [isDone, setIsDone] = useState(false);
    const [picked, setPicked] = useState<string | null>(null);

    const handlePick = (opt: typeof QUESTIONS[0]['options'][0]) => {
        if (picked) return;
        setPicked(opt.label);
        setTimeout(() => {
            const next = [...answers, opt];
            if (step < QUESTIONS.length - 1) {
                setAnswers(next);
                setStep(s => s + 1);
                setPicked(null);
            } else {
                setAnswers(next);
                setIsDone(true);
                setPicked(null);
            }
        }, 520);
    };

    const reset = () => { setStep(0); setAnswers([]); setIsDone(false); setPicked(null); };

    const results = useMemo(() => {
        if (!isDone) return [];
        const allVibes = answers.flatMap(a => a.vibes);
        const budgetAns = answers.find(a => (a as any).maxPrice != null) as any;
        const maxPrice = budgetAns?.maxPrice ?? 9999;
        const scored = cafes
            .filter(c => c.priceForTwo <= maxPrice)
            .map(c => ({ cafe: c, score: c.vibes.filter(v => allVibes.includes(v)).length }))
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(x => x.cafe);
        return scored.length > 0 ? scored : cafes.slice(0, 3);
    }, [cafes, answers, isDone]);

    return (
        <div>
            {/* ── Header strip ── */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8B0A0]">
                    {isDone ? 'Fortune Revealed' : `Mood Picker · ${QUESTIONS[step].round}`}
                </p>
                <button
                    onClick={reset}
                    className="flex items-center gap-1.5 text-[11px] font-semibold
                     text-[#A8B0A0] hover:text-[#1a4fcc] transition-colors"
                >
                    <RotateCcw className="w-3 h-3" /> Reset
                </button>
            </div>

            {/* ── Card ── */}
            <div className="bg-white rounded-3xl border border-[#EAEEE8]
                      shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* ── Quiz panel ── */}
                    {!isDone && (
                        <motion.div
                            key={`q-${step}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="p-6 flex flex-col items-center"
                        >
                            {/* Step progress */}
                            <div className="flex gap-1.5 w-full mb-5">
                                {QUESTIONS.map((_, i) => (
                                    <div key={i} className="h-[3px] flex-1 rounded-full bg-[#E4EEF9] overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[#1a4fcc] rounded-full"
                                            animate={{ width: i <= step ? '100%' : '0%' }}
                                            transition={{ duration: 0.36, delay: i === step ? 0.1 : 0 }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Question */}
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C0C8B8] mb-1">
                                Pick one
                            </p>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`q-text-${step}`}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[20px] font-bold text-[#1E2020] leading-snug mb-9 text-center"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}
                                >
                                    {QUESTIONS[step].q}
                                </motion.p>
                            </AnimatePresence>

                            {/* The actual fortune teller */}
                            <FortuneTeller
                                step={step}
                                options={QUESTIONS[step].options}
                                picked={picked}
                                onPick={handlePick}
                            />

                            {/* Hint */}
                            <motion.p
                                animate={{ opacity: [0.4, 0.9, 0.4] }}
                                transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                                className="text-[10px] text-[#C8D0C0] font-medium mt-6 tracking-widest uppercase"
                            >
                                tap a flap
                            </motion.p>
                        </motion.div>
                    )}

                    {/* ── Results panel ── */}
                    {isDone && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                            className="p-6"
                        >
                            <div className="mb-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8B0A0] mb-1">
                                    Your match
                                </p>
                                <p
                                    className="text-[22px] font-bold leading-snug"
                                    style={{
                                        fontFamily: "'Playfair Display', Georgia, serif",
                                        fontStyle: 'italic',
                                        color: '#1a4fcc',
                                    }}
                                >
                                    {results.length} café{results.length !== 1 ? 's' : ''}
                                </p>
                                <p
                                    className="text-[15px] italic text-[#A8B0A0]"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                >
                                    for your vibe.
                                </p>
                            </div>

                            <div>
                                {results.map((cafe, i) => (
                                    <React.Fragment key={cafe.id}>
                                        <motion.div
                                            initial={{ opacity: 0, x: 16 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 280, damping: 24 }}
                                        >
                                            <Link to={`/cafes/${cafe.id}`} className="flex items-center gap-4 py-4 group">
                                                <div className="w-[52px] h-[52px] rounded-2xl overflow-hidden flex-shrink-0
                                        ring-2 ring-transparent group-hover:ring-[#1a4fcc]/20
                                        transition-all duration-300">
                                                    <img
                                                        src={cafe.photos[0]} alt={cafe.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className="text-[15px] font-bold italic truncate leading-snug
                                       text-[#1E2020] group-hover:text-[#1a4fcc] transition-colors"
                                                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                                                    >
                                                        {cafe.name}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-2.5 h-2.5 text-[#C0C8B8] flex-shrink-0" />
                                                        <p className="text-[11px] text-[#A8B0A0] font-semibold uppercase tracking-wider truncate">
                                                            {cafe.area.replace(', Aurangabad', '')}
                                                        </p>
                                                    </div>
                                                    <p className="text-[11px] text-[#C8D0C0] font-medium mt-0.5">
                                                        ₹{cafe.priceForTwo} for two
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#F4F4F2]
                                        group-hover:bg-[#1a4fcc] flex items-center justify-center
                                        transition-colors duration-200">
                                                    <ArrowRight className="w-3.5 h-3.5 text-[#A8B0A0] group-hover:text-white transition-colors" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                        {i < results.length - 1 && <div className="h-px bg-[#F0F2EC]" />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};