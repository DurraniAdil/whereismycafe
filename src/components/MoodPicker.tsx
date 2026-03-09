import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, MapPin, RotateCcw } from 'lucide-react';
import { Cafe, Vibe } from '../types/cafe';

interface Option {
    label: string;
    sub: string;
    vibes: Vibe[];
    maxPrice?: number;
}

interface Question {
    q: string;
    round: string;
    options: Option[];
}

const QUESTIONS: Question[] = [
    {
        q: "What's the plan?",
        round: '01 / 03',
        options: [
            { label: 'Just vibing', sub: 'No agenda at all', vibes: ['Chill'] },
            { label: 'Gotta focus', sub: 'Work mode activated', vibes: ['Study', 'Work'] },
            { label: "It's a date", sub: 'Two of us', vibes: ['Date'] },
            { label: "Squad's here", sub: 'The whole gang', vibes: ['Party', 'Chill'] },
        ],
    },
    {
        q: 'What energy?',
        round: '02 / 03',
        options: [
            { label: 'Pin-drop', sub: 'Total silence', vibes: ['Study', 'Work'] },
            { label: 'Soft murmur', sub: 'Chill background', vibes: ['Chill', 'Work'] },
            { label: 'Lively', sub: 'Some noise is fine', vibes: ['Chill', 'Date'] },
            { label: 'Full send', sub: 'Loud and buzzing', vibes: ['Party'] },
        ],
    },
    {
        q: 'Budget?',
        round: '03 / 03',
        options: [
            { label: 'Cheap', sub: 'Under ₹300', vibes: [], maxPrice: 300 },
            { label: 'Mid range', sub: 'Under ₹600', vibes: [], maxPrice: 600 },
            { label: 'Fancy', sub: 'Under ₹1000', vibes: [], maxPrice: 1000 },
            { label: 'No limit', sub: "Sky's the limit", vibes: [], maxPrice: 99999 },
        ],
    },
];

// ── Option card ─────────────────────────────────────────────
const OptionCard: React.FC<{
    opt: Option;
    idx: number;
    state: 'idle' | 'chosen' | 'out';
    onPick: () => void;
}> = ({ opt, idx, state, onPick }) => (
    <motion.button
        initial={{ opacity: 0, y: 4 }}
        animate={
            state === 'out' ? { opacity: 0, scale: 0.95, y: 8 } :
                state === 'chosen' ? { opacity: 1, scale: 1.02, y: -2 } :
                    { opacity: 1, scale: 1, y: 0 }
        }
        transition={
            state === 'idle'
                ? { delay: idx * 0.04, duration: 0.2, ease: 'easeOut' }
                : { duration: 0.22, ease: 'easeOut' }
        }
        whileHover={state === 'idle'
            ? { scale: 1.02, y: -1, zIndex: 10, transition: { duration: 0.14, ease: 'easeOut' } }
            : {}
        }
        whileTap={state === 'idle' ? { scale: 0.94, y: 0 } : {}}
        onClick={state === 'idle' ? onPick : undefined}
        disabled={state !== 'idle'}
        className={`relative w-full text-left rounded-2xl px-4 py-[18px]
                border-2 overflow-hidden select-none
                ${state === 'chosen'
                // ── chosen: brand blue ──
                ? 'bg-[#0b4e9d] border-[#0b4e9d] shadow-[0_8px_28px_rgba(11,78,157,0.32)] cursor-default'
                : state === 'out'
                    ? 'bg-[#F8F7F4] border-[#F0F0EC] cursor-default'
                    : 'bg-white border-[#EAEEE8] hover:border-[#0b4e9d]/30 cursor-pointer'
            }`}
    >
        {/* Ripple flash — white expanding ring on pick */}
        {state === 'chosen' && (
            <motion.span
                initial={{ scale: 0, opacity: 0.4 }}
                animate={{ scale: 6, opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute inset-0 block bg-white rounded-full pointer-events-none"
                style={{ transformOrigin: 'center' }}
            />
        )}

        {/* Label — Playfair italic */}
        <p className={`text-[15px] font-bold leading-snug
                   ${state === 'chosen' ? 'text-white' : 'text-[#1E2020]'}`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
            {opt.label}
        </p>

        {/* Sub-label */}
        <p className={`text-[11px] font-medium mt-1.5
                   ${state === 'chosen' ? 'text-white/55' : 'text-[#A8B0A0]'}`}>
            {opt.sub}
        </p>
    </motion.button>
);

// ── Main ────────────────────────────────────────────────────
export const MoodPicker: React.FC<{ cafes: Cafe[] }> = ({ cafes }) => {
    const [step, setStep] = useState(0);
    const [pickedLabel, setPickedLabel] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Option[]>([]);
    const [results, setResults] = useState<Cafe[]>([]);
    const [done, setDone] = useState(false);

    const handlePick = useCallback((opt: Option) => {
        if (pickedLabel !== null) return;
        setPickedLabel(opt.label);

        const newAnswers = [...answers, opt];

        setTimeout(() => {
            if (step < QUESTIONS.length - 1) {
                setAnswers(newAnswers);
                setStep(s => s + 1);
                setPickedLabel(null);
            } else {
                const allVibes = newAnswers.flatMap(a => a.vibes);
                const maxPrice = newAnswers.find(a => a.maxPrice != null)?.maxPrice ?? 9999;

                const scored = cafes
                    .filter(c => c.priceForTwo <= maxPrice)
                    .map(c => ({ cafe: c, score: c.vibes.filter(v => allVibes.includes(v)).length }))
                    .filter(x => x.score > 0)
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 3)
                    .map(x => x.cafe);

                setResults(scored.length > 0 ? scored : cafes.slice(0, 3));
                setDone(true);
            }
        }, 500);
    }, [pickedLabel, answers, step, cafes]);

    const reset = () => {
        setStep(0);
        setPickedLabel(null);
        setAnswers([]);
        setResults([]);
        setDone(false);
    };

    return (
        <div>
            {/* Section label */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8B0A0]">
                    Mood Picker
                </p>
                {(step > 0 || done) && (
                    <button onClick={reset}
                        className="flex items-center gap-1.5 text-[11px] font-semibold
                       text-[#A8B0A0] hover:text-[#0b4e9d] transition-colors">
                        <RotateCcw className="w-3 h-3" /> Reset
                    </button>
                )}
            </div>

            <div className="bg-white rounded-3xl border border-[#EAEEE8]
                      shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* ── Question screen ───────────────────────── */}
                    {!done && (
                        <motion.div
                            key={`q-${step}`}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                            className="p-6"
                        >
                            {/* Progress bars */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex gap-1.5 flex-1">
                                    {QUESTIONS.map((_, i) => (
                                        <div key={i}
                                            className="h-[3px] flex-1 rounded-full bg-[#EBF1FB] overflow-hidden">
                                            <motion.div
                                                // ── fill: brand blue ──
                                                className="h-full bg-[#0b4e9d] rounded-full"
                                                animate={{ width: i <= step ? '100%' : '0%' }}
                                                transition={{ duration: 0.38, delay: i === step ? 0.08 : 0 }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-[#C8D4E8] tracking-[0.15em] flex-shrink-0">
                                    {QUESTIONS[step].round}
                                </span>
                            </div>

                            {/* Eyebrow */}
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C0C8B8] mb-2">
                                Pick one
                            </p>

                            {/* Question */}
                            <p className="text-[22px] font-bold text-[#1E2020] leading-[1.15] mb-7"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
                                {QUESTIONS[step].q}
                            </p>

                            {/* 2×2 grid */}
                            <div className="grid grid-cols-2 gap-2.5">
                                {QUESTIONS[step].options.map((opt, i) => (
                                    <OptionCard
                                        key={opt.label}
                                        opt={opt}
                                        idx={i}
                                        state={
                                            pickedLabel === null ? 'idle' :
                                                pickedLabel === opt.label ? 'chosen' :
                                                    'out'
                                        }
                                        onPick={() => handlePick(opt)}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* ── Results screen ────────────────────────── */}
                    {done && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 22 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.38 }}
                            className="p-6"
                        >
                            {/* Header */}
                            <div className="mb-6">
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em]
                              text-[#A8B0A0] mb-1.5">
                                    Your match
                                </p>
                                <p className="text-[22px] font-bold leading-snug text-[#0b4e9d]"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
                                    {results.length} café{results.length !== 1 ? 's' : ''}
                                </p>
                                <p className="text-[17px] font-normal italic text-[#A8B0A0] leading-snug"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    for your vibe.
                                </p>
                            </div>

                            {/* Café list */}
                            <div>
                                {results.map((cafe, i) => (
                                    <React.Fragment key={cafe.id}>
                                        <motion.div
                                            initial={{ opacity: 0, x: 18 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.1 + i * 0.1,
                                                type: 'spring', stiffness: 300, damping: 24,
                                            }}
                                        >
                                            <Link to={`/cafes/${cafe.id}`}
                                                className="flex items-center gap-4 py-4 group">

                                                {/* Photo */}
                                                <div className="w-[52px] h-[52px] rounded-2xl overflow-hidden flex-shrink-0
                                        ring-2 ring-transparent group-hover:ring-[#0b4e9d]/20
                                        transition-all duration-300">
                                                    <img src={cafe.photos[0]} alt={cafe.name}
                                                        className="w-full h-full object-cover
                                       group-hover:scale-110 transition-transform duration-500" />
                                                </div>

                                                {/* Text */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[15px] font-bold italic truncate leading-snug
                                        text-[#1E2020] group-hover:text-[#0b4e9d] transition-colors"
                                                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                                        {cafe.name}
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-0.5">
                                                        <MapPin className="w-2.5 h-2.5 text-[#C0C8B8] flex-shrink-0" />
                                                        <p className="text-[11px] text-[#A8B0A0] font-semibold
                                          uppercase tracking-wider truncate">
                                                            {cafe.area.replace(', Aurangabad', '')}
                                                        </p>
                                                    </div>
                                                    <p className="text-[11px] text-[#C8D0C0] font-medium mt-0.5">
                                                        ₹{cafe.priceForTwo} for two
                                                    </p>
                                                </div>

                                                {/* Arrow — brand blue on hover */}
                                                <div className="flex-shrink-0 w-8 h-8 rounded-xl
                                        bg-[#F4F4F2] group-hover:bg-[#0b4e9d]
                                        flex items-center justify-center
                                        transition-colors duration-200">
                                                    <ArrowRight className="w-3.5 h-3.5 text-[#A8B0A0]
                                                  group-hover:text-white transition-colors" />
                                                </div>
                                            </Link>
                                        </motion.div>
                                        {i < results.length - 1 && (
                                            <div className="h-px bg-[#F0F2EC]" />
                                        )}
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
