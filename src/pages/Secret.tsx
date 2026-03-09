import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getAllCafes } from '../lib/getCafes';

// ── Types ────────────────────────────────────────────────────
interface MatrixDrop {
    id: number;
    x: number;
    chars: string;
    speed: number;
    opacity: number;
}

// ── Constants ────────────────────────────────────────────────
const TERMINAL_LINES = [
    '> Initializing WIMC secret protocol...',
    '> Verifying user curiosity level... OK',
    '> Bypassing vibe filters...',
    '> Unlocking developer mode... OK',
    '> Loading classified cafe data...',
    '> Access granted. Welcome, coffee obsessive.',
];

const DEVELOPER_PICKS: { id: string; note: string }[] = [
    { id: 'cafe-003', note: 'The light hits different at 5pm. Take someone.' },
    { id: 'cafe-040', note: 'Best espresso in the city. Not debatable.' },
    { id: 'cafe-042', note: 'Found this by accident. Never leaving.' },
    { id: 'cafe-054', note: 'CCB when it\'s 11pm and I need to think.' },
    { id: 'cafe-051', note: 'Ti Coffee Aani Mi. The name is everything.' },
];

// Matrix characters (katakana + latin + digits)
const MATRIX_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFabcdef';

function randomMatrixString(len: number) {
    let s = '';
    for (let i = 0; i < len; i++) {
        s += MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)];
    }
    return s;
}

// ── Component ────────────────────────────────────────────────
export const Secret: React.FC = () => {
    const navigate = useNavigate();
    const allCafes = getAllCafes();

    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [showContent, setShowContent] = useState(false);
    const [showHero, setShowHero] = useState(false);
    const [matrixDrops, setMatrixDrops] = useState<MatrixDrop[]>([]);
    const [clickedPickId, setClickedPickId] = useState<string | null>(null);
    const dropCounter = useRef(0);

    // Terminal typewriter
    useEffect(() => {
        let i = 0;
        const iv = setInterval(() => {
            if (i < TERMINAL_LINES.length) {
                setTerminalLines(prev => [...prev, TERMINAL_LINES[i++]]);
            } else {
                clearInterval(iv);
                setTimeout(() => setShowContent(true), 500);
                setTimeout(() => setShowHero(true), 900);
            }
        }, 380);
        return () => clearInterval(iv);
    }, []);

    // Matrix rain drops
    useEffect(() => {
        const iv = setInterval(() => {
            setMatrixDrops(prev => [
                ...prev.slice(-24),
                {
                    id: dropCounter.current++,
                    x: Math.random() * 100,
                    chars: randomMatrixString(8 + Math.floor(Math.random() * 12)),
                    speed: 4 + Math.random() * 5,
                    opacity: 0.06 + Math.random() * 0.12,
                },
            ]);
        }, 200);
        return () => clearInterval(iv);
    }, []);

    const picks = DEVELOPER_PICKS
        .map(p => ({ ...p, cafe: allCafes.find(c => c.id === p.id) }))
        .filter(p => p.cafe);

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden relative">

            {/* ── Matrix rain background ──────────────────────── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <AnimatePresence>
                    {matrixDrops.map(drop => (
                        <motion.div
                            key={drop.id}
                            className="absolute font-mono text-[10px] leading-[1.1] select-none"
                            style={{
                                left: `${drop.x}%`,
                                top: '-20%',
                                color: '#00FF41',
                                opacity: drop.opacity,
                                writingMode: 'vertical-rl',
                                textOrientation: 'upright',
                                letterSpacing: '2px',
                            }}
                            animate={{ y: typeof window !== 'undefined' ? window.innerHeight + 200 : 1000 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: drop.speed, ease: 'linear' }}
                        >
                            {drop.chars}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Radial glow blobs — matrix green */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[600px] h-[600px] rounded-full
                        bg-[#00FF41]/4 blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full
                        bg-[#00FF41]/3 blur-[80px]" />
            </div>

            {/* ── Page content ───────────────────────────────── */}
            <div className="relative z-10 max-w-md mx-auto px-5 py-12">

                {/* ── Terminal block ──────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0F0F0F] border border-[#1E1E1E] rounded-2xl p-5 mb-8 font-mono"
                >
                    {/* Traffic lights */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                        <div className="w-3 h-3 rounded-full bg-[#28C840]" />
                        <span className="ml-3 text-[10px] text-[#333] tracking-wider">
                            wimc — secret@localhost ~
                        </span>
                    </div>

                    {/* Lines */}
                    <div className="space-y-2 min-h-[120px]">
                        {terminalLines.map((line, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.18 }}
                                className={`text-[12px] leading-relaxed flex items-center gap-2 ${line.includes('OK') ? 'text-[#00FF41]' :
                                    line.includes('granted') ? 'text-[#00FF41] font-bold' :
                                        line.includes('Unlocking') ? 'text-[#7EB8F7]' :
                                            'text-[#555]'
                                    }`}
                            >
                                {line}
                                {i === terminalLines.length - 1 && !showContent && (
                                    <motion.span
                                        animate={{ opacity: [1, 0] }}
                                        transition={{ duration: 0.6, repeat: Infinity }}
                                        className="text-[#00FF41]"
                                    >_</motion.span>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── Main content ────────────────────────────── */}
                <AnimatePresence>
                    {showContent && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4 }}
                        >

                            {/* Mascot + hero text */}
                            <div className="flex flex-col items-center text-center mb-10">
                                <motion.div
                                    className="relative mb-6"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    {/* Glow ring */}
                                    <div className="absolute inset-0 rounded-full bg-[#00FF41]/20
                                  blur-2xl scale-150 animate-pulse" />
                                    {/* Outer ring */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-2 border-[#00FF41]/20"
                                        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0, 0.4] }}
                                        transition={{ duration: 2.5, repeat: Infinity }}
                                    />
                                    <img
                                        src={`${import.meta.env.BASE_URL}media/circle.png`}
                                        alt="Logo"
                                        className="w-24 h-24 rounded-full object-cover relative z-10
                               border-2 border-[#00FF41]/40
                               shadow-[0_0_50px_rgba(0,255,65,0.2)]"
                                    />
                                </motion.div>

                                <AnimatePresence>
                                    {showHero && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 12, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                                        >
                                            <motion.p
                                                className="text-[10px] font-bold text-[#00FF41] uppercase
                                   tracking-[0.25em] mb-3"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.2 }}
                                            >
                        // Easter egg unlocked
                                            </motion.p>

                                            <h2 className="text-[28px] font-black leading-tight tracking-tight mb-3"
                                                style={{ fontFamily: 'Georgia, serif' }}>
                                                You found<br />
                                                <span className="text-[#00FF41]">the secret page.</span>
                                            </h2>

                                            <p className="text-sm text-[#555] leading-relaxed max-w-[280px] mx-auto">
                                                You clicked the logo 5 times.<br />
                                                That kind of curiosity deserves something real.
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>


                            {/* ── Divider ─────────────────────────────── */}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="flex-1 h-px bg-[#1E1E1E]" />
                                <span className="text-[10px] font-bold text-[#333] uppercase tracking-[0.2em]">
                                    Dev's personal picks
                                </span>
                                <div className="flex-1 h-px bg-[#1E1E1E]" />
                            </div>

                            {/* ── Developer picks ──────────────────────── */}
                            <div className="space-y-2.5 mb-8">
                                {picks.map(({ cafe, note, id }, i) => (
                                    <motion.div
                                        key={id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.35 + i * 0.1, duration: 0.3 }}
                                        onClick={() => {
                                            setClickedPickId(id);
                                            setTimeout(() => navigate(`/cafes/${id}`), 300);
                                        }}
                                        className={`flex items-start gap-4 rounded-2xl p-4 cursor-pointer
                                border transition-all duration-200 group
                                ${clickedPickId === id
                                                ? 'bg-[#00FF41]/10 border-[#00FF41]/40'
                                                : 'bg-[#0F0F0F] border-[#1A1A1A] hover:border-[#00FF41]/30 hover:bg-[#131313]'
                                            }`}
                                    >
                                        <div className="w-8 h-8 rounded-xl bg-[#00FF41]/10 border border-[#00FF41]/20
                                    flex items-center justify-center flex-shrink-0
                                    font-mono text-xs text-[#00FF41] font-bold
                                    group-hover:bg-[#00FF41]/20 transition-colors">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-white truncate group-hover:text-[#F5F5F5]">
                                                {cafe!.name}
                                            </p>
                                            <p className="text-[11px] text-[#00FF41]/70 mt-0.5 italic leading-snug">
                                                "{note}"
                                            </p>
                                            <p className="text-[10px] text-[#3A3A3A] mt-1 font-medium">{cafe!.area}</p>
                                        </div>
                                        <motion.span
                                            className="text-[#333] text-xs self-center flex-shrink-0
                                 group-hover:text-[#00FF41] transition-colors"
                                        >
                                            →
                                        </motion.span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* ── Footer note ──────────────────────────── */}
                            <motion.div
                                className="text-center mb-10"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.5 }}
                            >
                                <p className="text-[11px] text-[#2E2E2E] font-mono leading-relaxed">
                                    Built in Aurangabad.<br />
                                    Fuelled by cold coffee and the inability<br />
                                    to stop building things. — WIMC Dev
                                </p>
                            </motion.div>

                            {/* ── Back button ──────────────────────────── */}
                            <motion.button
                                onClick={() => navigate('/')}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.6 }}
                                whileTap={{ scale: 0.97 }}
                                className="w-full py-4 mb-24 rounded-2xl border border-[#1E1E1E]
                           text-sm font-bold text-[#444] font-mono
                           hover:border-[#00FF41]/40 hover:text-[#00FF41]/60
                           transition-all duration-200"
                            >
                                {'<-'} Go back before anyone sees you here
                            </motion.button>

                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
