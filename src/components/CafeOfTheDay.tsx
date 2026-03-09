import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, ChevronLeft, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { Cafe } from '../types/cafe';

// ── Config ──────────────────────────────────────────────────
const TIMER_MS = 5000;
const TICK_MS = 100;
const CAFE_COUNT = 3;

const EDITORIAL_CAPTIONS: Record<string, string> = {
    'cafe-001': 'Best corner table in the city.',
    'cafe-002': 'Order the cold coffee. No questions.',
    'cafe-003': 'The playlist alone is worth the trip.',
    'cafe-040': 'Best espresso in the city. Not debatable.',
    'cafe-042': 'Found this by accident. Never leaving.',
    'cafe-054': 'When it\'s 11pm and you need to think.',
};
const DEFAULT_CAPTION = "Today's pick from us to you.";

export function getDailyCafes(allCafes: Cafe[], count = CAFE_COUNT): Cafe[] {
    const today = new Date();
    const dayOfYear = Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
    );
    return Array.from({ length: count }, (_, i) =>
        allCafes[(dayOfYear * (i + 1) * 7) % allCafes.length]
    );
}

// ── Single slide ────────────────────────────────────────────
const CafeSlide: React.FC<{ cafe: Cafe }> = ({ cafe }) => {
    const caption = EDITORIAL_CAPTIONS[cafe.id] ?? DEFAULT_CAPTION;

    return (
        <Link
            to={`/cafes/${cafe.id}`}
            className="block group flex-shrink-0 w-full snap-center"
            draggable={false}
        >
            <div className="relative h-64 w-full rounded-3xl overflow-hidden select-none">

                {/* Photo */}
                <img
                    src={cafe.photos[0]}
                    alt={cafe.name}
                    draggable={false}
                    className="w-full h-full object-cover
                     transition-transform duration-700 group-hover:scale-[1.03]
                     pointer-events-none"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t
                        from-black/90 via-black/20 to-transparent" />

                {/* ── Top-right: Discover pill — logo blue ── */}
                <div className="absolute top-4 right-4
                        bg-[#0b4e9d] text-white text-[10px] font-black
                        uppercase tracking-[0.16em]
                        px-3 py-1.5 rounded-full
                        flex items-center gap-1
                        shadow-[0_2px_10px_rgba(11,78,157,0.55)]
                        group-hover:shadow-[0_4px_18px_rgba(11,78,157,0.7)]
                        transition-all duration-300">
                    Discover <ChevronRight className="w-3 h-3" />
                </div>

                {/* ── Top-left: Rating — white glass ── */}
                {cafe.rating > 0 && (
                    <div className="absolute top-4 left-4
                          bg-white/15 backdrop-blur-md border border-white/25
                          rounded-full px-2.5 py-1.5 flex items-center gap-1.5">
                        <Star className="w-3 h-3 fill-[#F5A623] text-[#F5A623]" />
                        <span className="text-white text-[11px] font-bold">
                            {cafe.rating.toFixed(1)}
                        </span>
                    </div>
                )}

                {/* ── Bottom text block ── */}
                <div className="absolute bottom-0 left-0 right-0 p-5">

                    {/* Caption — italic Playfair, muted */}
                    <p className="text-white/40 text-[11px] italic mb-2 font-normal leading-snug"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        "{caption}"
                    </p>

                    {/* Café name — Playfair bold italic, large */}
                    <h3 className="text-white text-[26px] font-bold italic leading-[1.1] tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {cafe.name}
                    </h3>

                    {/* Area row */}
                    <div className="flex items-center gap-1.5 mt-2">
                        <MapPin className="w-3 h-3 text-white/35 flex-shrink-0" />
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-[0.16em]">
                            {cafe.area.replace(', Aurangabad', '')}
                        </span>
                    </div>
                </div>

            </div>
        </Link>
    );
};

// ── Main ────────────────────────────────────────────────────
export const CafeOfTheDay: React.FC<{ cafes: Cafe[] }> = ({ cafes }) => {
    const picks = getDailyCafes(cafes);
    const [active, setActive] = useState(0);
    const [progress, setProgress] = useState(0);
    const [paused, setPaused] = useState(false);

    const elapsedRef = useRef(0);
    const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const scrollStartX = useRef(0);

    const goTo = useCallback((idx: number) => {
        const next = (idx + picks.length) % picks.length;
        setActive(next);
        elapsedRef.current = 0;
        setProgress(0);
        scrollRef.current?.scrollTo({ left: next * (scrollRef.current.clientWidth), behavior: 'smooth' });
    }, [picks.length]);

    // ── Timer ─────────────────────────────────────────────────
    useEffect(() => {
        if (paused) return;
        tickerRef.current = setInterval(() => {
            elapsedRef.current += TICK_MS;
            setProgress(Math.min((elapsedRef.current / TIMER_MS) * 100, 100));
            if (elapsedRef.current >= TIMER_MS) {
                elapsedRef.current = 0;
                setActive(a => {
                    const next = (a + 1) % picks.length;
                    scrollRef.current?.scrollTo({ left: next * (scrollRef.current.clientWidth), behavior: 'smooth' });
                    return next;
                });
            }
        }, TICK_MS);
        return () => { if (tickerRef.current) clearInterval(tickerRef.current); };
    }, [paused, picks.length]);

    const handleScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el || isDragging.current) return;
        const idx = Math.round(el.scrollLeft / el.clientWidth);
        if (idx !== active && idx >= 0 && idx < picks.length) {
            setActive(idx);
            elapsedRef.current = 0;
            setProgress(0);
        }
    }, [active, picks.length]);

    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        dragStartX.current = e.clientX;
        scrollStartX.current = scrollRef.current?.scrollLeft ?? 0;
        setPaused(true);
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        scrollRef.current.scrollLeft = scrollStartX.current + (dragStartX.current - e.clientX);
    };
    const onMouseUp = () => {
        if (!isDragging.current) return;
        isDragging.current = false;
        setPaused(false);
        handleScroll();
    };

    return (
        <div>

            {/* ── Header ──────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8B0A0]">
                    Cafés of the Day
                </p>
                <p className="text-[10px] text-[#A8B0A0] font-medium italic"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {new Date().toLocaleDateString('en-IN', {
                        weekday: 'long', day: 'numeric', month: 'short',
                    })}
                </p>
            </div>

            {/* ── Carousel ──────────────────────────────────────── */}
            <div className="relative group/carousel">
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                    onMouseEnter={() => setPaused(true)}
                    className="flex overflow-x-auto snap-x snap-mandatory rounded-3xl
                     cursor-grab active:cursor-grabbing
                     [scrollbar-width:none] [-ms-overflow-style:none]
                     [&::-webkit-scrollbar]:hidden"
                    style={{ scrollBehavior: 'auto' }}
                >
                    {picks.map(cafe => (
                        <CafeSlide key={cafe.id} cafe={cafe} />
                    ))}
                </div>

                {/* Desktop arrow buttons — blue on hover */}
                {[{ dir: -1, Icon: ChevronLeft, side: 'left-3' },
                { dir: 1, Icon: ChevronRight, side: 'right-3' }
                ].map(({ dir, Icon, side }) => (
                    <button key={side}
                        onClick={() => goTo(active + dir)}
                        className={`hidden md:flex absolute ${side} top-1/2 -translate-y-1/2
                        w-9 h-9 rounded-full
                        bg-white/10 backdrop-blur-sm border border-white/15
                        items-center justify-center text-white/50
                        hover:bg-[#0b4e9d] hover:border-[#0b4e9d] hover:text-white
                        opacity-0 group-hover/carousel:opacity-100
                        transition-all duration-200 z-10
                        shadow-[0_2px_10px_rgba(0,0,0,0.25)]`}
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                ))}
            </div>

            {/* ── Progress dots — blue fill ─────────────────────── */}
            <div className="flex items-center justify-center gap-3 mt-4">
                {picks.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="relative h-[3px] rounded-full overflow-hidden bg-[#E0E5EF]
                       transition-all duration-300"
                        style={{ width: i === active ? 32 : 12 }}
                    >
                        {i === active && (
                            <motion.div
                                className="absolute inset-y-0 left-0 bg-[#0b4e9d] rounded-full"
                                style={{ width: `${progress}%` }}
                            />
                        )}
                    </button>
                ))}
            </div>

        </div>
    );
};
