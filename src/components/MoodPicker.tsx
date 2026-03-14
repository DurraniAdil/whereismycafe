import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Coffee, Sparkles, Heart, Moon, Sun, Wind, Flame, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cafe, Vibe } from '../types/cafe';

const FLAP_COLORS = [
    { bg: '#EBF1FB', hover: '#D6E4F7', text: '#0b4e9d', icon: '#0b4e9d' },
    { bg: '#FFF4EC', hover: '#FFE8D6', text: '#c4501a', icon: '#c4501a' },
    { bg: '#F0FBF4', hover: '#D6F7E4', text: '#2d7a4e', icon: '#2d7a4e' },
    { bg: '#F5F0FB', hover: '#E8D6F7', text: '#5c3d9e', icon: '#5c3d9e' },
];

const QUESTIONS = [
    {
        q: "What's the plan?",
        round: '01 / 03',
        options: [
            { label: 'Work', sub: 'Heads down', vibes: ['Work', 'Study'] as Vibe[], icon: Sparkles },
            { label: 'Date', sub: 'Just us two', vibes: ['Date'] as Vibe[], icon: Heart },
            { label: 'Chill', sub: 'No agenda', vibes: ['Chill'] as Vibe[], icon: Coffee },
            { label: 'Squad', sub: 'The gang', vibes: ['Party', 'Chill'] as Vibe[], icon: Flame },
        ],
    },
    {
        q: 'What energy?',
        round: '02 / 03',
        options: [
            { label: 'Quiet', sub: 'Pin-drop', vibes: ['Study'] as Vibe[], icon: Moon },
            { label: 'Buzz', sub: 'Lively', vibes: ['Work'] as Vibe[], icon: Sun },
            { label: 'Vibe', sub: 'Soft murmur', vibes: ['Chill'] as Vibe[], icon: Wind },
            { label: 'Loud', sub: 'Full send', vibes: ['Party'] as Vibe[], icon: Flame },
        ],
    },
    {
        q: 'Budget?',
        round: '03 / 03',
        options: [
            { label: 'Easy', sub: 'Under ₹300', vibes: [] as Vibe[], maxPrice: 300, icon: Coffee },
            { label: 'Mid', sub: 'Under ₹600', vibes: [] as Vibe[], maxPrice: 600, icon: Coffee },
            { label: 'Fancy', sub: '₹1000 max', vibes: [] as Vibe[], maxPrice: 1000, icon: Heart },
            { label: 'Open', sub: 'No limit', vibes: [] as Vibe[], maxPrice: 99999, icon: Sparkles },
        ],
    },
];

// ── Single flap ─────────────────────────────────────────────
const Flap: React.FC<{
    opt: typeof QUESTIONS[0]['options'][0];
    index: number;
    picked: boolean;
    disabled: boolean;
    onPick: () => void;
}> = ({ opt, index, picked, disabled, onPick }) => {
    const Icon = opt.icon;
    const rotation = index * 90;
    const color = FLAP_COLORS[index];

    return (
        <motion.button
            onClick={onPick}
            disabled={disabled}
            className="absolute inset-0 w-full h-full origin-center"
            style={{ clipPath: 'polygon(50% 50%, 0% 0%, 100% 0%)' }}
            animate={{
                rotate: rotation,
                scale: picked ? 1.06 : 1,
                opacity: picked ? 0.7 : 1,
            }}
            whileHover={!disabled ? { scale: 1.03, y: -2 } : {}}
            whileTap={!disabled ? { scale: 0.97 } : {}}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
            <div
                className="w-full h-full flex flex-col items-center pt-8 sm:pt-10 transition-colors duration-150"
                style={{ background: picked ? color.hover : color.bg }}
            >
                <div
                    style={{ transform: `rotate(-${rotation}deg)` }}
                    className="flex flex-col items-center gap-1"
                >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: color.icon }} />
                    <span
                        className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.12em]"
                        style={{
                            color: color.text,
                            fontFamily: "'Playfair Display', Georgia, serif",
                            fontStyle: 'italic',
                        }}
                    >
                        {opt.label}
                    </span>
                    <span className="text-[9px] font-medium" style={{ color: color.icon + '99' }}>
                        {opt.sub}
                    </span>
                </div>
            </div>
        </motion.button>
    );
};

// ── Main ────────────────────────────────────────────────────
export const MoodPicker: React.FC<{ cafes: Cafe[] }> = ({ cafes }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<typeof QUESTIONS[0]['options'][0][]>([]);
    const [isDone, setIsDone] = useState(false);
    const [picked, setPicked] = useState<string | null>(null);

    const handlePick = (opt: typeof QUESTIONS[0]['options'][0]) => {
        if (picked) return;
        setPicked(opt.label);

        setTimeout(() => {
            const newAnswers = [...answers, opt];
            if (step < QUESTIONS.length - 1) {
                setAnswers(newAnswers);
                setStep(s => s + 1);
                setPicked(null);
            } else {
                setAnswers(newAnswers);
                setIsDone(true);
                setPicked(null);
            }
        }, 380);
    };

    const reset = () => {
        setStep(0);
        setAnswers([]);
        setIsDone(false);
        setPicked(null);
    };

    const results = useMemo(() => {
        if (!isDone) return [];
        const allVibes = answers.flatMap(a => a.vibes);
        const maxPrice = answers.find(a => a.maxPrice != null)?.maxPrice ?? 9999;

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
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8B0A0]">
                    {isDone ? 'Fortune Revealed' : `Mood Picker · ${QUESTIONS[step].round}`}
                </p>
                <button
                    onClick={reset}
                    className="flex items-center gap-1.5 text-[11px] font-semibold
            text-[#A8B0A0] hover:text-[#0b4e9d] transition-colors"
                >
                    <RotateCcw className="w-3 h-3" /> Reset
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAEEE8]
        shadow-[0_2px_16px_rgba(0,0,0,0.05)] overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* ── Fortune teller ── */}
                    {!isDone && (
                        <motion.div
                            key={`q-${step}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="p-6 flex flex-col items-center"
                        >
                            {/* Progress */}
                            <div className="flex gap-1.5 w-full mb-6">
                                {QUESTIONS.map((_, i) => (
                                    <div key={i} className="h-[3px] flex-1 rounded-full bg-[#EBF1FB] overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[#0b4e9d] rounded-full"
                                            animate={{ width: i <= step ? '100%' : '0%' }}
                                            transition={{ duration: 0.38, delay: i === step ? 0.1 : 0 }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Question */}
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C0C8B8] mb-1.5">
                                Pick one
                            </p>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={`question-${step}`}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[20px] font-bold text-[#1E2020] leading-snug mb-7 text-center"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}
                                >
                                    {QUESTIONS[step].q}
                                </motion.p>
                            </AnimatePresence>

                            {/* Fortune teller — container fixed, flaps spin */}
                            <div className="relative w-64 h-64 sm:w-72 sm:h-72">



                                {/* Flap group — this is what spins 360° on transition */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={`flaps-${step}`}
                                        className="absolute inset-0"
                                        initial={{ rotate: -360, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 360, opacity: 0 }}
                                        transition={{
                                            rotate: { type: 'spring', stiffness: 160, damping: 22 },
                                            opacity: { duration: 0.18 }
                                        }}
                                    >
                                        {QUESTIONS[step].options.map((opt, i) => (
                                            <Flap
                                                key={opt.label}
                                                opt={opt}
                                                index={i}
                                                picked={picked === opt.label}
                                                disabled={picked !== null}
                                                onPick={() => handlePick(opt)}
                                            />
                                        ))}
                                    </motion.div>
                                </AnimatePresence>

                                {/* Center pin — never moves */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        w-5 h-5 rounded-full bg-white border-2 border-[#0b4e9d]/25
        shadow-[0_2px_8px_rgba(11,78,157,0.12)] z-20 pointer-events-none" />
                            </div>

                            <p className="text-[10px] text-[#C8D0C0] font-medium mt-5 tracking-wide">
                                tap a flap
                            </p>
                        </motion.div>
                    )}
                    {/* ── Results ── */}
                    {isDone && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
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
                                    className="text-[22px] font-bold leading-snug text-[#0b4e9d]"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}
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
                          ring-2 ring-transparent group-hover:ring-[#0b4e9d]/20 transition-all duration-300">
                                                    <img src={cafe.photos[0]} alt={cafe.name}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className="text-[15px] font-bold italic truncate leading-snug
                              text-[#1E2020] group-hover:text-[#0b4e9d] transition-colors"
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
                          group-hover:bg-[#0b4e9d] flex items-center justify-center transition-colors duration-200">
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
