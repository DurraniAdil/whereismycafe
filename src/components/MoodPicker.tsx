import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RotateCcw, Coffee, Sparkles, Heart, Moon,
    Sun, Wind, Flame, MapPin, ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Cafe, Vibe } from '../types/cafe';

/* ──────────────────────────────────────────────────────────────────────── */
/*  DESIGN TOKENS                                                          */
/* ──────────────────────────────────────────────────────────────────────── */

// 4 petal colours — soft pastels matching WIMC brand palette
const PETAL_COLORS = [
    { bg: '#E4B8C0', dark: '#D4979F', name: 'blush' },     // top-left  (blush)
    { bg: '#A8CCE0', dark: '#89B5D0', name: 'sky' },       // top-right (sky)
    { bg: '#B5D9CC', dark: '#95C4B3', name: 'sage' },      // bottom-left (sage)
    { bg: '#E8D8B5', dark: '#DACA9D', name: 'sand' },      // bottom-right (sand)
] as const;

const INNER_COLORS = [
    { bg: '#E4B8C0', dark: '#D4979F' }, // 8
    { bg: '#A8CCE0', dark: '#89B5D0' }, // 1
    { bg: '#A8CCE0', dark: '#89B5D0' }, // 2
    { bg: '#E8D8B5', dark: '#DACA9D' }, // 3
    { bg: '#E8D8B5', dark: '#DACA9D' }, // 4
    { bg: '#B5D9CC', dark: '#95C4B3' }, // 5
    { bg: '#B5D9CC', dark: '#95C4B3' }, // 6
    { bg: '#E4B8C0', dark: '#D4979F' }, // 7
];

/* ──────────────────────────────────────────────────────────────────────── */
/*  QUESTIONS (same café-matching logic)                                   */
/* ──────────────────────────────────────────────────────────────────────── */

interface QuestionOption {
    label: string;
    sub: string;
    vibes: Vibe[];
    maxPrice?: number;
    icon: React.FC<{ style?: React.CSSProperties }>;
    letterCount: number;
}

const OUTER_OPTIONS: QuestionOption[] = [
    { label: 'Work', sub: 'Heads down', vibes: ['Work', 'Study'], icon: Sparkles, letterCount: 4 },
    { label: 'Date', sub: 'Just us two', vibes: ['Date'], icon: Heart, letterCount: 4 },
    { label: 'Chill', sub: 'No agenda', vibes: ['Chill'], icon: Coffee, letterCount: 5 },
    { label: 'Squad', sub: 'The gang', vibes: ['Party', 'Chill'], icon: Flame, letterCount: 5 },
];

const NUMBER_OPTIONS: QuestionOption[] = [
    { label: '8', sub: '', vibes: ['Study'], icon: Moon, letterCount: 8 },
    { label: '1', sub: '', vibes: ['Work'], icon: Sun, letterCount: 1 },
    { label: '2', sub: '', vibes: ['Chill'], icon: Wind, letterCount: 2 },
    { label: '3', sub: '', vibes: ['Party'], icon: Flame, letterCount: 3 },
    { label: '4', sub: '', vibes: ['Date'], icon: Heart, letterCount: 4 },
    { label: '5', sub: '', vibes: ['Work', 'Study'], icon: Sparkles, letterCount: 5 },
    { label: '6', sub: '', vibes: ['Chill'], icon: Coffee, letterCount: 6 },
    { label: '7', sub: '', vibes: ['Party', 'Chill'], icon: Flame, letterCount: 7 },
];

const BUDGET_OPTIONS: QuestionOption[] = [
    { label: 'Easy', sub: 'Under ₹300', vibes: [], maxPrice: 300, icon: Coffee, letterCount: 0 },
    { label: 'Mid', sub: 'Under ₹600', vibes: [], maxPrice: 600, icon: Sun, letterCount: 0 },
    { label: 'Fancy', sub: '₹1K max', vibes: [], maxPrice: 1000, icon: Heart, letterCount: 0 },
    { label: 'Open', sub: 'No limit', vibes: [], maxPrice: 99999, icon: Sparkles, letterCount: 0 },
];

type Phase =
    | 'closed'          // Show outer 4 color flaps
    | 'animating'       // Open/close animation (horizontal ↔ vertical)
    | 'numbers'         // Show inner 8 number flaps
    | 'animating2'      // Second open/close animation
    | 'open'            // Show all 8 inner triangles for final pick
    | 'budget'          // Budget selection
    | 'reveal'          // Show fortune / café result
    ;

/* ──────────────────────────────────────────────────────────────────────── */
/*  SVG BASED COOTIE CATCHER                                               */
/* ──────────────────────────────────────────────────────────────────────── */

// Closed view — 4 colored petals (diamond shape)
const ClosedView: React.FC<{
    onPick: (index: number) => void;
    disabled: boolean;
}> = ({ onPick, disabled }) => {
    const SIZE = 280;
    const HALF = SIZE / 2;

    // Each petal is a triangle from center to two adjacent corners of the diamond
    // The diamond is rotated 45deg, so corners at top/right/bottom/left
    const petalPaths = [
        // Top-left petal
        `M ${HALF} 0 L 0 ${HALF} L ${HALF} ${HALF} Z`,
        // Top-right petal
        `M ${HALF} 0 L ${SIZE} ${HALF} L ${HALF} ${HALF} Z`,
        // Bottom-left petal
        `M 0 ${HALF} L ${HALF} ${SIZE} L ${HALF} ${HALF} Z`,
        // Bottom-right petal
        `M ${SIZE} ${HALF} L ${HALF} ${SIZE} L ${HALF} ${HALF} Z`,
    ];

    // Label positions (center of each triangle)
    const labelPositions = [
        { x: HALF * 0.5, y: HALF * 0.55 },       // top-left
        { x: HALF * 1.5, y: HALF * 0.55 },       // top-right
        { x: HALF * 0.5, y: HALF * 1.45 },       // bottom-left
        { x: HALF * 1.5, y: HALF * 1.45 },       // bottom-right
    ];

    return (
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.18)) drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
            {/* Petals */}
            {petalPaths.map((d, i) => (
                <g key={i}>
                    <motion.path
                        d={d}
                        fill={PETAL_COLORS[i].bg}
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth={1.5}
                        style={{ cursor: disabled ? 'default' : 'pointer' }}
                        whileHover={disabled ? {} : { fill: PETAL_COLORS[i].dark, scale: 1.02 }}
                        whileTap={disabled ? {} : { scale: 0.97 }}
                        onClick={() => !disabled && onPick(i)}
                    />
                    {/* Sheen */}
                    <path d={d} fill="url(#sheen)" style={{ pointerEvents: 'none' }} opacity={0.3} />
                </g>
            ))}

            {/* Fold creases */}
            <line x1={0} y1={0} x2={SIZE} y2={SIZE} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
            <line x1={SIZE} y1={0} x2={0} y2={SIZE} stroke="rgba(255,255,255,0.4)" strokeWidth={2} />
            <line x1={HALF} y1={0} x2={HALF} y2={SIZE} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
            <line x1={0} y1={HALF} x2={SIZE} y2={HALF} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />

            {/* Labels */}
            {OUTER_OPTIONS.map((opt, i) => (
                <text key={i}
                    x={labelPositions[i].x} y={labelPositions[i].y}
                    textAnchor="middle" dominantBaseline="middle"
                    fill="#3A3A3A" fontSize={14} fontWeight={800}
                    fontFamily="'DM Mono', 'Courier New', monospace"
                    letterSpacing="0.1em"
                    style={{ pointerEvents: 'none', textTransform: 'uppercase' }}
                >
                    {opt.label}
                </text>
            ))}

            {/* Gradient defs */}
            <defs>
                <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="white" stopOpacity={0.5} />
                    <stop offset="50%" stopColor="white" stopOpacity={0} />
                </linearGradient>
            </defs>
        </svg>
    );
};

// Horizontal open view (top-bottom flaps open, showing left-right inner)
const HorizontalOpenView: React.FC<{ showNumbers: boolean }> = ({ showNumbers }) => {
    const W = 300;
    const H = 220;
    const CX = W / 2;
    const CY = H / 2;

    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
            style={{ filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.15))' }}>
            {/* Left top triangle (rose) */}
            <path d={`M ${CX - 90} 0 L ${CX} ${CY} L ${CX - 10} 0 Z`} fill={PETAL_COLORS[0].bg} />
            {/* Right top triangle (sky) */}
            <path d={`M ${CX + 10} 0 L ${CX} ${CY} L ${CX + 90} 0 Z`} fill={PETAL_COLORS[1].bg} />
            {/* Center-left rect */}
            <path d={`M ${CX - 90} 0 L ${CX - 90} ${H} L ${CX} ${CY} Z`} fill={PETAL_COLORS[0].dark} />
            {/* Center-right rect */}
            <path d={`M ${CX + 90} 0 L ${CX + 90} ${H} L ${CX} ${CY} Z`} fill={PETAL_COLORS[1].dark} />
            {/* Left bottom triangle (mint) */}
            <path d={`M ${CX - 90} ${H} L ${CX} ${CY} L ${CX - 10} ${H} Z`} fill={PETAL_COLORS[2].bg} />
            {/* Right bottom triangle (gold) */}
            <path d={`M ${CX + 10} ${H} L ${CX} ${CY} L ${CX + 90} ${H} Z`} fill={PETAL_COLORS[3].bg} />

            {/* Inner square showing through */}
            <rect x={CX - 90} y={0} width={180} height={H} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

            {/* Fold lines */}
            <line x1={CX - 90} y1={0} x2={CX} y2={CY} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={CX + 90} y1={0} x2={CX} y2={CY} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={CX - 90} y1={H} x2={CX} y2={CY} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={CX + 90} y1={H} x2={CX} y2={CY} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />

            {showNumbers && (
                <>
                    <text x={CX - 45} y={CY - 20} textAnchor="middle" fill="#3A3A3A" fontSize={24} fontWeight={800} fontFamily="'Playfair Display', serif" style={{ fontStyle: 'italic' }}>7</text>
                    <text x={CX + 45} y={CY - 20} textAnchor="middle" fill="#3A3A3A" fontSize={24} fontWeight={800} fontFamily="'Playfair Display', serif" style={{ fontStyle: 'italic' }}>1</text>
                    <text x={CX - 45} y={CY + 30} textAnchor="middle" fill="#3A3A3A" fontSize={24} fontWeight={800} fontFamily="'Playfair Display', serif" style={{ fontStyle: 'italic' }}>5</text>
                    <text x={CX + 45} y={CY + 30} textAnchor="middle" fill="#3A3A3A" fontSize={24} fontWeight={800} fontFamily="'Playfair Display', serif" style={{ fontStyle: 'italic' }}>3</text>
                </>
            )}
        </svg>
    );
};

// Vertical open view (left-right flaps open, showing top-bottom inner)
const VerticalOpenView: React.FC<{ showNumbers: boolean }> = ({ showNumbers }) => {
    const W = 220;
    const H = 300;
    const CX = W / 2;
    const CY = H / 2;

    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
            style={{ filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.15))' }}>
            {/* Top-left triangle (rose) */}
            <path d={`M 0 ${CY - 90} L ${CX} ${CY} L 0 ${CY - 10} Z`} fill={PETAL_COLORS[0].bg} />
            {/* Top-right triangle (sky) */}
            <path d={`M ${W} ${CY - 90} L ${CX} ${CY} L ${W} ${CY - 10} Z`} fill={PETAL_COLORS[1].bg} />
            {/* Top center */}
            <path d={`M 0 ${CY - 90} L ${W} ${CY - 90} L ${CX} ${CY} Z`} fill={PETAL_COLORS[0].dark} />
            {/* Bottom center */}
            <path d={`M 0 ${CY + 90} L ${W} ${CY + 90} L ${CX} ${CY} Z`} fill={PETAL_COLORS[2].dark} />
            {/* Bottom-left triangle (mint) */}
            <path d={`M 0 ${CY + 10} L ${CX} ${CY} L 0 ${CY + 90} Z`} fill={PETAL_COLORS[2].bg} />
            {/* Bottom-right triangle (gold) */}
            <path d={`M ${W} ${CY + 10} L ${CX} ${CY} L ${W} ${CY + 90} Z`} fill={PETAL_COLORS[3].bg} />

            <rect x={0} y={CY - 90} width={W} height={180} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth={1.5} />

            {/* Fold lines */}
            <line x1={0} y1={CY - 90} x2={CX} y2={CY} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={W} y1={CY - 90} x2={CX} y2={CY} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={0} y1={CY + 90} x2={CX} y2={CY} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
            <line x1={W} y1={CY + 90} x2={CX} y2={CY} stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />

            {showNumbers && (
                <>
                    <text x={CX - 20} y={CY - 30} textAnchor="middle" fill="#3A3A3A" fontSize={24} fontWeight={800} fontFamily="'Playfair Display', serif" style={{ fontStyle: 'italic' }}>8</text>
                    <text x={CX + 25} y={CY - 30} textAnchor="middle" fill="#3A3A3A" fontSize={24} fontWeight={800} fontFamily="'Playfair Display', serif" style={{ fontStyle: 'italic' }}>2</text>
                    <text x={CX - 20} y={CY + 40} textAnchor="middle" fill="#3A3A3A" fontSize={24} fontWeight={800} fontFamily="'Playfair Display', serif" style={{ fontStyle: 'italic' }}>6</text>
                    <text x={CX + 25} y={CY + 40} textAnchor="middle" fill="#3A3A3A" fontSize={24} fontWeight={800} fontFamily="'Playfair Display', serif" style={{ fontStyle: 'italic' }}>4</text>
                </>
            )}
        </svg>
    );
};

// Fully opened view with all 8 inner triangles — for final flap selection
const FullyOpenedView: React.FC<{
    onPick: (index: number) => void;
    disabled: boolean;
    revealedFlap: number | null;
    fortuneText: string | null;
}> = ({ onPick, disabled, revealedFlap, fortuneText }) => {
    const SIZE = 300;
    const HALF = SIZE / 2;

    // 8 inner triangles, 2 per quadrant
    const triangles = [
        // Top-left quadrant: 8, 7
        { d: `M 0 0 L ${HALF} 0 L ${HALF} ${HALF} Z`, num: '8', color: INNER_COLORS[0] },
        { d: `M 0 0 L 0 ${HALF} L ${HALF} ${HALF} Z`, num: '7', color: INNER_COLORS[7] },
        // Top-right quadrant: 1, 2
        { d: `M ${HALF} 0 L ${SIZE} 0 L ${HALF} ${HALF} Z`, num: '1', color: INNER_COLORS[1] },
        { d: `M ${SIZE} 0 L ${SIZE} ${HALF} L ${HALF} ${HALF} Z`, num: '2', color: INNER_COLORS[2] },
        // Bottom-right quadrant: 3, 4
        { d: `M ${SIZE} ${HALF} L ${SIZE} ${SIZE} L ${HALF} ${HALF} Z`, num: '3', color: INNER_COLORS[3] },
        { d: `M ${SIZE} ${SIZE} L ${HALF} ${SIZE} L ${HALF} ${HALF} Z`, num: '4', color: INNER_COLORS[4] },
        // Bottom-left quadrant: 5, 6
        { d: `M ${HALF} ${SIZE} L 0 ${SIZE} L ${HALF} ${HALF} Z`, num: '5', color: INNER_COLORS[5] },
        { d: `M 0 ${SIZE} L 0 ${HALF} L ${HALF} ${HALF} Z`, num: '6', color: INNER_COLORS[6] },
    ];

    // Label positions for each triangle
    const labelPos = [
        { x: HALF * 0.65, y: HALF * 0.35 },
        { x: HALF * 0.35, y: HALF * 0.65 },
        { x: HALF * 1.35, y: HALF * 0.35 },
        { x: HALF * 1.65, y: HALF * 0.65 },
        { x: HALF * 1.65, y: HALF * 1.35 },
        { x: HALF * 1.35, y: HALF * 1.65 },
        { x: HALF * 0.65, y: HALF * 1.65 },
        { x: HALF * 0.35, y: HALF * 1.35 },
    ];

    // Fortune text positions (centered in each triangle region)
    const fortunePositions: Record<number, { x: number; y: number }> = {
        0: { x: HALF * 0.5, y: HALF * 0.35 },
        1: { x: HALF * 0.35, y: HALF * 0.6 },
        2: { x: HALF * 1.35, y: HALF * 0.35 },
        3: { x: HALF * 1.65, y: HALF * 0.6 },
        4: { x: HALF * 1.65, y: HALF * 1.35 },
        5: { x: HALF * 1.35, y: HALF * 1.6 },
        6: { x: HALF * 0.65, y: HALF * 1.6 },
        7: { x: HALF * 0.35, y: HALF * 1.35 },
    };

    return (
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}
            style={{ filter: 'drop-shadow(0 16px 40px rgba(0,0,0,0.18)) drop-shadow(0 4px 12px rgba(0,0,0,0.1))' }}>
            {triangles.map((tri, i) => {
                const isRevealed = revealedFlap === i;
                return (
                    <g key={i}>
                        <motion.path
                            d={tri.d}
                            fill={isRevealed ? '#fff' : tri.color.bg}
                            stroke="rgba(255,255,255,0.3)"
                            strokeWidth={1.5}
                            style={{ cursor: disabled ? 'default' : 'pointer' }}
                            whileHover={disabled ? {} : { fill: tri.color.dark }}
                            whileTap={disabled ? {} : { scale: 0.98 }}
                            onClick={() => !disabled && onPick(i)}
                            animate={{ fill: isRevealed ? '#fff' : tri.color.bg }}
                            transition={{ duration: 0.4 }}
                        />
                        {!isRevealed && (
                            <text
                                x={labelPos[i].x} y={labelPos[i].y}
                                textAnchor="middle" dominantBaseline="middle"
                                fill="#3A3A3A" fontSize={22} fontWeight={800}
                                fontFamily="'Playfair Display', serif"
                                style={{ pointerEvents: 'none', fontStyle: 'italic' }}
                            >
                                {tri.num}
                            </text>
                        )}
                        {isRevealed && fortuneText && (
                            <foreignObject
                                x={fortunePositions[i].x - 35}
                                y={fortunePositions[i].y - 15}
                                width={70} height={40}
                                style={{ overflow: 'visible' }}
                            >
                                <div style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: tri.color.bg,
                                    textAlign: 'center',
                                    fontFamily: "'DM Mono', monospace",
                                    lineHeight: 1.2,
                                    wordBreak: 'break-word',
                                }}>
                                    {fortuneText}
                                </div>
                            </foreignObject>
                        )}
                    </g>
                );
            })}

            {/* Fold creases */}
            <line x1={0} y1={0} x2={SIZE} y2={SIZE} stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} />
            <line x1={SIZE} y1={0} x2={0} y2={SIZE} stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} />
            <line x1={HALF} y1={0} x2={HALF} y2={SIZE} stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} />
            <line x1={0} y1={HALF} x2={SIZE} y2={HALF} stroke="rgba(0,0,0,0.12)" strokeWidth={1.5} />

            {/* Outer border */}
            <rect x={0.5} y={0.5} width={SIZE - 1} height={SIZE - 1} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth={1.5} />
        </svg>
    );
};

// Budget selection — 4 cards since we skip the cootie catcher for the budget step
const BudgetView: React.FC<{
    onPick: (opt: QuestionOption) => void;
    disabled: boolean;
}> = ({ onPick, disabled }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 280 }}>
            {BUDGET_OPTIONS.map((opt, i) => {
                const Icon = opt.icon;
                return (
                    <motion.button
                        key={opt.label}
                        onClick={() => !disabled && onPick(opt)}
                        disabled={disabled}
                        style={{
                            background: PETAL_COLORS[i].bg,
                            border: 'none',
                            borderRadius: 16,
                            padding: '18px 12px',
                            cursor: disabled ? 'default' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                        }}
                        whileHover={disabled ? {} : { scale: 1.04, filter: 'brightness(1.1)' }}
                        whileTap={disabled ? {} : { scale: 0.96 }}
                    >
                        <Icon style={{ width: 18, height: 18, color: '#3A3A3A' }} />
                        <span style={{
                            color: '#3A3A3A',
                            fontWeight: 800,
                            fontSize: 13,
                            fontFamily: "'DM Mono', monospace",
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                        }}>{opt.label}</span>
                        <span style={{
                            color: 'rgba(60,60,60,0.6)',
                            fontSize: 10,
                            fontFamily: "'DM Mono', monospace",
                        }}>{opt.sub}</span>
                    </motion.button>
                );
            })}
        </div>
    );
};

/* ──────────────────────────────────────────────────────────────────────── */
/*  MAIN COMPONENT                                                         */
/* ──────────────────────────────────────────────────────────────────────── */

export const MoodPicker: React.FC<{ cafes: Cafe[] }> = ({ cafes }) => {
    const [phase, setPhase] = useState<Phase>('closed');
    const [animFrame, setAnimFrame] = useState(0); // 0 = horizontal, 1 = vertical...
    const [animCount, setAnimCount] = useState(0);
    const [targetAnimCount, setTargetAnimCount] = useState(0);
    const [answers, setAnswers] = useState<QuestionOption[]>([]);
    const [revealedFlap, setRevealedFlap] = useState<number | null>(null);
    const [fortuneCafe, setFortuneCafe] = useState<Cafe | null>(null);

    const animIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Clean up interval on unmount
    useEffect(() => {
        return () => {
            if (animIntervalRef.current) clearInterval(animIntervalRef.current);
        };
    }, []);

    // Animation runner
    const startAnimation = useCallback((count: number, nextPhase: Phase) => {
        setAnimCount(0);
        setTargetAnimCount(count);
        setAnimFrame(0);

        let frame = 0;
        animIntervalRef.current = setInterval(() => {
            frame++;
            setAnimFrame(frame);
            setAnimCount(frame);

            if (frame >= count) {
                if (animIntervalRef.current) clearInterval(animIntervalRef.current);
                animIntervalRef.current = null;
                // Small delay before showing next state
                setTimeout(() => {
                    setPhase(nextPhase);
                }, 300);
            }
        }, 420);
    }, []);

    // Step 1: Pick a color (outer flap)
    const handleOuterPick = useCallback((index: number) => {
        const opt = OUTER_OPTIONS[index];
        setAnswers([opt]);
        setPhase('animating');
        startAnimation(opt.letterCount, 'numbers');
    }, [startAnimation]);

    // Step 2: Pick a number
    const handleNumberPick = useCallback((index: number) => {
        const opt = NUMBER_OPTIONS[index];
        setAnswers(prev => [...prev, opt]);
        setPhase('animating2');
        startAnimation(opt.letterCount, 'open');
    }, [startAnimation]);

    // Step 3: Pick a flap to reveal
    const handleFlapReveal = useCallback((index: number) => {
        setRevealedFlap(index);
        // Move to budget after reveal
        setTimeout(() => {
            setPhase('budget');
        }, 800);
    }, []);

    // Step 4: Pick budget
    const handleBudgetPick = useCallback((opt: QuestionOption) => {
        setAnswers(prev => [...prev, opt]);
        setPhase('reveal');
    }, []);

    // Reset
    const reset = useCallback(() => {
        if (animIntervalRef.current) clearInterval(animIntervalRef.current);
        animIntervalRef.current = null;
        setPhase('closed');
        setAnswers([]);
        setAnimFrame(0);
        setAnimCount(0);
        setTargetAnimCount(0);
        setRevealedFlap(null);
        setFortuneCafe(null);
    }, []);

    // Compute results
    const results = useMemo(() => {
        if (phase !== 'reveal') return [];
        const allVibes = answers.flatMap(a => a.vibes);
        const budgetAns = answers.find(a => a.maxPrice != null);
        const maxPrice = budgetAns?.maxPrice ?? 9999;
        const scored = cafes
            .filter(c => c.priceForTwo <= maxPrice)
            .map(c => ({ cafe: c, score: c.vibes.filter(v => allVibes.includes(v)).length }))
            .filter(x => x.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(x => x.cafe);
        return scored.length > 0 ? scored : cafes.slice(0, 3);
    }, [cafes, answers, phase]);

    // Derive the question heading
    const heading = (() => {
        switch (phase) {
            case 'closed': return "What's the plan?";
            case 'animating':
            case 'animating2': return 'Reading your fortune...';
            case 'numbers': return 'Pick a number';
            case 'open': return 'Pick a flap';
            case 'budget': return 'Budget?';
            case 'reveal': return 'Your fortune!';
        }
    })();

    const roundLabel = (() => {
        switch (phase) {
            case 'closed': return '01 / 04';
            case 'animating':
            case 'numbers': return '02 / 04';
            case 'animating2':
            case 'open': return '03 / 04';
            case 'budget': return '04 / 04';
            case 'reveal': return 'Done';
        }
    })();

    // Number picker — for "numbers" phase, show the fully opened view but only allow clicking on H/V visible numbers
    const visibleNumbers = useMemo(() => {
        // After first animation, show 4 numbers based on last animation frame
        // If last frame was horizontal (even), show numbers on vertical positions and vice versa
        if (phase === 'numbers') {
            return animFrame % 2 === 0
                ? [0, 2, 4, 6] // horizontal view: show 8,1,3,5 -> indices 0,2,4,6
                : [1, 3, 5, 7]; // vertical view: show 7,2,5,4 -> indices 1,3,5,7
        }
        return [];
    }, [phase, animFrame]);

    return (
        <div>
            {/* ── Header strip ── */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8B0A0]">
                    {phase === 'reveal' ? 'Fortune Revealed' : `Mood Picker · ${roundLabel}`}
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

                    {/* ── Active game ── */}
                    {phase !== 'reveal' && (
                        <motion.div
                            key={`game-${phase}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-6 flex flex-col items-center"
                        >
                            {/* Step progress */}
                            <div className="flex gap-1.5 w-full mb-5">
                                {[0, 1, 2, 3].map(i => {
                                    const stepIndex =
                                        phase === 'closed' ? 0 :
                                            phase === 'animating' || phase === 'numbers' ? 1 :
                                                phase === 'animating2' || phase === 'open' ? 2 :
                                                    3;
                                    return (
                                        <div key={i} className="h-[3px] flex-1 rounded-full bg-[#E4EEF9] overflow-hidden">
                                            <motion.div
                                                className="h-full rounded-full"
                                                style={{ background: PETAL_COLORS[i].bg }}
                                                animate={{ width: i <= stepIndex ? '100%' : '0%' }}
                                                transition={{ duration: 0.36, delay: i === stepIndex ? 0.1 : 0 }}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Question */}
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C0C8B8] mb-1">
                                {phase === 'animating' || phase === 'animating2' ? 'Shuffling' : 'Pick one'}
                            </p>
                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={heading}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[20px] font-bold text-[#1E2020] leading-snug mb-7 text-center"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}
                                >
                                    {heading}
                                </motion.p>
                            </AnimatePresence>

                            {/* ── Cootie Catcher Display ── */}
                            <div style={{ minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AnimatePresence mode="wait">
                                    {/* Closed state */}
                                    {phase === 'closed' && (
                                        <motion.div
                                            key="closed"
                                            initial={{ scale: 0.8, opacity: 0, rotateY: 20 }}
                                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                            exit={{ scale: 0.7, opacity: 0, rotateY: -30 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                            style={{ perspective: 600 }}
                                        >
                                            <ClosedView onPick={handleOuterPick} disabled={false} />
                                        </motion.div>
                                    )}

                                    {/* Animating (first animation) — smooth varied 3D transforms */}
                                    {phase === 'animating' && (
                                        <motion.div
                                            key={`anim1-${animFrame}`}
                                            initial={{
                                                scale: 0.7 + (animFrame % 3) * 0.05,
                                                opacity: 0,
                                                rotateX: animFrame % 2 === 0 ? 25 + (animFrame % 3) * 10 : -(15 + (animFrame % 4) * 8),
                                                rotateY: animFrame % 2 === 0 ? -(10 + (animFrame % 3) * 5) : 20 + (animFrame % 4) * 6,
                                                rotateZ: animFrame % 3 === 0 ? 3 : animFrame % 3 === 1 ? -2 : 0,
                                            }}
                                            animate={{ scale: 1, opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0 }}
                                            exit={{
                                                scale: 0.75,
                                                opacity: 0,
                                                rotateX: animFrame % 2 === 0 ? -20 : 15,
                                                rotateY: animFrame % 2 === 0 ? 12 : -18,
                                            }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 220 + (animFrame % 3) * 30,
                                                damping: 18 + (animFrame % 4) * 3,
                                            }}
                                            style={{ perspective: 700, transformStyle: 'preserve-3d' }}
                                        >
                                            {animFrame % 2 === 0
                                                ? <HorizontalOpenView showNumbers={false} />
                                                : <VerticalOpenView showNumbers={false} />
                                            }
                                        </motion.div>
                                    )}

                                    {/* Numbers state */}
                                    {phase === 'numbers' && (
                                        <motion.div
                                            key="numbers"
                                            initial={{ scale: 0.85, opacity: 0, rotateY: 15 }}
                                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                                            exit={{ scale: 0.7, opacity: 0, rotateY: -30 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                            style={{ perspective: 600 }}
                                        >
                                            <FullyOpenedView
                                                onPick={handleNumberPick}
                                                disabled={false}
                                                revealedFlap={null}
                                                fortuneText={null}
                                            />
                                        </motion.div>
                                    )}

                                    {/* Animating (second animation) — smooth varied 3D transforms */}
                                    {phase === 'animating2' && (
                                        <motion.div
                                            key={`anim2-${animFrame}`}
                                            initial={{
                                                scale: 0.72 + (animFrame % 4) * 0.04,
                                                opacity: 0,
                                                rotateX: animFrame % 2 === 0 ? -(20 + (animFrame % 3) * 12) : 18 + (animFrame % 4) * 7,
                                                rotateY: animFrame % 2 === 0 ? 22 + (animFrame % 4) * 5 : -(12 + (animFrame % 3) * 8),
                                                rotateZ: animFrame % 3 === 0 ? -2.5 : animFrame % 3 === 1 ? 3.5 : 0,
                                                y: animFrame % 2 === 0 ? -8 : 8,
                                            }}
                                            animate={{ scale: 1, opacity: 1, rotateX: 0, rotateY: 0, rotateZ: 0, y: 0 }}
                                            exit={{
                                                scale: 0.78,
                                                opacity: 0,
                                                rotateX: animFrame % 2 === 0 ? 18 : -22,
                                                rotateY: animFrame % 2 === 0 ? -15 : 10,
                                            }}
                                            transition={{
                                                type: 'spring',
                                                stiffness: 200 + (animFrame % 4) * 25,
                                                damping: 16 + (animFrame % 3) * 4,
                                            }}
                                            style={{ perspective: 700, transformStyle: 'preserve-3d' }}
                                        >
                                            {animFrame % 2 === 0
                                                ? <HorizontalOpenView showNumbers={true} />
                                                : <VerticalOpenView showNumbers={true} />
                                            }
                                        </motion.div>
                                    )}

                                    {/* Open state — pick a flap */}
                                    {phase === 'open' && (
                                        <motion.div
                                            key="open"
                                            initial={{ scale: 0.85, opacity: 0, rotateX: 20 }}
                                            animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                                            exit={{ scale: 0.7, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                            style={{ perspective: 600 }}
                                        >
                                            <FullyOpenedView
                                                onPick={handleFlapReveal}
                                                disabled={revealedFlap !== null}
                                                revealedFlap={revealedFlap}
                                                fortuneText={revealedFlap !== null ? 'Fate!' : null}
                                            />
                                        </motion.div>
                                    )}

                                    {/* Budget */}
                                    {phase === 'budget' && (
                                        <motion.div
                                            key="budget"
                                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                            animate={{ scale: 1, opacity: 1, y: 0 }}
                                            exit={{ scale: 0.9, opacity: 0, y: -20 }}
                                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                        >
                                            <BudgetView onPick={handleBudgetPick} disabled={false} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Hint */}
                            {(phase === 'closed' || phase === 'numbers' || phase === 'open') && (
                                <motion.p
                                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                                    className="text-[10px] text-[#C8D0C0] font-medium mt-4 tracking-widest uppercase"
                                >
                                    {phase === 'closed' ? 'tap a color' : phase === 'numbers' ? 'tap a number' : 'tap a flap to reveal'}
                                </motion.p>
                            )}
                            {(phase === 'animating' || phase === 'animating2') && (
                                <motion.div
                                    className="mt-4 flex items-center gap-2"
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                                >
                                    <div className="flex gap-1">
                                        {Array.from({ length: targetAnimCount }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-2 h-2 rounded-full transition-colors duration-300"
                                                style={{
                                                    background: i < animCount
                                                        ? PETAL_COLORS[i % 4].bg
                                                        : '#E4EEF9',
                                                }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* ── Results panel ── */}
                    {phase === 'reveal' && (
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
                                        color: PETAL_COLORS[1].bg,
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