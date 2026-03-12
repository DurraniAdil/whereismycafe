import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Code2, PenLine, MapPin, Coffee,
    Zap, Users, ArrowRight
} from 'lucide-react';
import { useLogoClick } from '../hooks/useLogoClick';
import { PageLoadingSkeleton } from '../components/PageLoadingSkeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';

// ── Fade-up wrapper ─────────────────────────────────────────
const FadeUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({
    children, delay = 0,
}) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
        {children}
    </motion.div>
);

// ── Data ────────────────────────────────────────────────────
const appRoadmap = [
    {
        phase: '01',
        title: 'Right now',
        description: 'Hand-curated list of Aurangabad\'s best cafés. Every detail verified, every vibe real.',
        status: 'live',
    },
    {
        phase: '02',
        title: 'Coming next',
        description: 'Going door to door — real photos, owner-verified info, and the full story of each café.',
        status: 'soon',
    },
    {
        phase: '03',
        title: 'The vision',
        description: 'Café owners manage their own profiles. Users upload photos. The city builds it together.',
        status: 'future',
    },
];

const skills = [
    { label: 'React.js', category: 'code' },
    { label: 'TypeScript', category: 'code' },
    { label: 'Next.js', category: 'code' },
    { label: 'Tailwind CSS', category: 'code' },
    { label: 'Framer Motion', category: 'code' },
    { label: 'Node.js', category: 'code' },
    { label: 'Firebase', category: 'code' },
    { label: 'Figma', category: 'design' },
    { label: 'SEO Writing', category: 'content' },
    { label: 'Copywriting', category: 'content' },
    { label: 'Poetry', category: 'content' },
    { label: 'Project Management', category: 'ops' },
];

const categoryColor: Record<string, string> = {
    code: 'bg-[#EAF0FB] text-[#0b4e9d] border-[#C8D8F0]',
    design: 'bg-violet-50 text-violet-700 border-violet-100',
    content: 'bg-amber-50  text-amber-700  border-amber-100',
    ops: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const stats = [
    { icon: Coffee, value: '65+', label: 'Cafés curated' },
    { icon: Code2, value: '10+', label: 'Dev projects' },
    { icon: PenLine, value: '300+', label: 'Original poems' },
    { icon: Users, value: '28', label: 'Gold medals' },
];

// ── Page ────────────────────────────────────────────────────
export const About: React.FC = () => {
    const handleLogoClick = useLogoClick();

    return (
        <div className="min-h-screen bg-[#F8F6F1]">

            {/* Desktop home logo */}
            <Link to="/" className="hidden md:block fixed top-6 right-6 z-50">
                <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Home"
                    className="w-12 h-12 rounded-full object-cover shadow-[0_4px_24px_rgba(11,78,157,0.25)] border-2 border-white hover:scale-105 transition-transform cursor-pointer" />
            </Link>

            {/* Mobile easter-egg logo */}
            <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="logo"
                onClick={handleLogoClick}
                className="md:hidden fixed top-6 right-6 z-50
                   w-12 h-12 rounded-full object-cover cursor-pointer
                   border-2 border-white
                   shadow-[0_2px_10px_rgba(11,78,157,0.18)]
                   hover:scale-105 transition-transform" />

            {/* ── HERO ──────────────────────────────────────────── */}
            <div className="px-5 pt-12 pb-10">
                <FadeUp>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]
                           text-[#A8B0A0] mb-4 block">
                        About
                    </span>

                    <div className="flex flex-col md:flex-row md:items-start md:gap-12">
                        {/* Title */}
                        <div className="md:flex-1">
                            <h1 className="text-5xl md:text-6xl font-bold text-[#1E2020]
                             leading-[1.1] tracking-tight"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                Where Is<br />
                                <span className="relative">
                                    My Cafe?
                                    {/* Brand blue squiggle */}
                                    <svg className="absolute -bottom-1.5 left-0 w-full"
                                        viewBox="0 0 200 8" preserveAspectRatio="none">
                                        <motion.path
                                            d="M0,5 Q25,1 50,5 Q75,9 100,5 Q125,1 150,5 Q175,9 200,5"
                                            fill="none" stroke="#0b4e9d" strokeWidth="2.5"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
                                        />
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-3xl md:text-4xl font-normal italic text-[#A8B0A0]
                            leading-tight mt-3"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                is for Aurangabad.
                            </p>
                        </div>

                        <div className="hidden md:block w-px bg-[#D8DDD0] self-stretch flex-shrink-0 my-1" />

                        {/* Body */}
                        <div className="md:flex-1 mt-6 md:mt-8 flex flex-col justify-center">
                            <p className="text-[15px] text-[#7A8478] leading-[1.8]">
                                Every city has a café scene. Aurangabad's just never had its own
                                guide — one that actually knows the difference between a study
                                corner and a date spot.
                            </p>
                            <p className="text-[15px] text-[#7A8478] leading-[1.8] mt-3">
                                This is that guide.
                            </p>
                        </div>
                    </div>
                </FadeUp>
            </div>

            <div className="px-5"><div className="h-px bg-[#D8DDD0]/60" /></div>

            {/* ── WHY THIS EXISTS ───────────────────────────────── */}
            <div className="px-5 py-10">
                <FadeUp>
                    <h2 className="text-xl font-bold text-[#1E2020] mb-4 tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Why this exists
                    </h2>
                </FadeUp>
                <FadeUp delay={0.1}>
                    <div className="bg-white rounded-3xl border border-[#EAEEE8]
                          shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 space-y-4">
                        <p className="text-[#7A8478] text-[14px] leading-relaxed">
                            Zomato shows you delivery times. Google Maps shows you a pin.
                            Neither tells you whether a place is quiet enough to actually
                            focus, or cozy enough to take someone on a first date.
                        </p>
                        <p className="text-[#7A8478] text-[14px] leading-relaxed">
                            Where Is My Cafe? filters by{' '}
                            <strong className="text-[#0b4e9d]">vibe</strong> — not cuisine,
                            not delivery radius. Study, Chill, Date, Party, Work. Every café
                            here has been picked deliberately, not scraped from an API.
                        </p>
                        <div className="flex items-center justify-center gap-2 pt-1">
                            <div className="flex-shrink-0 relative hidden sm:block">
                                <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Logo"
                                    className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white transform rotate-[-10deg]" />
                            </div>
                            <p className="text-[13px] text-[#7A8478] italic text-center">
                                Built by someone from here, for people from here.
                            </p>
                        </div>
                    </div>
                </FadeUp>
            </div>

            {/* ── ROADMAP ───────────────────────────────────────── */}
            <div className="px-5 pb-10">
                <FadeUp>
                    <h2 className="text-xl font-bold text-[#1E2020] mb-6 tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        How it's growing
                    </h2>
                </FadeUp>
                <div className="space-y-3">
                    {appRoadmap.map((item, i) => (
                        <FadeUp key={item.phase} delay={i * 0.1}>
                            <div className={`flex gap-4 rounded-2xl p-5 border transition-all
                              ${item.status === 'live'
                                    // live: brand blue
                                    ? 'bg-[#0b4e9d] border-[#0b4e9d] text-white shadow-[0_4px_18px_rgba(11,78,157,0.25)]'
                                    : 'bg-white border-[#EAEEE8] text-[#1E2020]'
                                }`}>
                                <span className={`text-2xl font-bold tabular-nums leading-none pt-0.5
                                  ${item.status === 'live' ? 'text-white/25' : 'text-[#D8DDD0]'}`}>
                                    {item.phase}
                                </span>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className={`font-bold text-[15px]
                                   ${item.status === 'live' ? 'text-white' : 'text-[#1E2020]'}`}
                                            style={{
                                                fontFamily: "'Playfair Display', Georgia, serif",
                                                fontStyle: 'italic'
                                            }}>
                                            {item.title}
                                        </p>
                                        {item.status === 'live' && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider
                                       bg-white/20 text-white px-2 py-0.5 rounded-full">
                                                Live
                                            </span>
                                        )}
                                        {item.status === 'soon' && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider
                                       bg-[#0b4e9d]/10 text-[#0b4e9d]
                                       px-2 py-0.5 rounded-full">
                                                Soon
                                            </span>
                                        )}
                                    </div>
                                    <p className={`text-[13px] leading-relaxed
                                 ${item.status === 'live' ? 'text-white/65' : 'text-[#7A8478]'}`}>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </FadeUp>
                    ))}
                </div>
            </div>


            {/* ── CTA — CAFÉ OWNERS ─────────────────────────────── */}
            <div className="px-5 pb-8">
                <FadeUp>
                    <div className="bg-[#0b4e9d] rounded-3xl p-6 text-white
                          shadow-[0_8px_32px_rgba(11,78,157,0.28)]">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-4 h-4 text-white/50" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
                                Café owners
                            </span>
                        </div>

                        <h3 className="text-xl font-bold mb-2 leading-tight"
                            style={{
                                fontFamily: "'Playfair Display', Georgia, serif",
                                fontStyle: 'italic'
                            }}>
                            Your café isn't on here yet?
                        </h3>

                        <p className="text-white/60 text-[13px] leading-relaxed mb-5">
                            Get listed for free. I also help cafés build websites, set up
                            Instagram, and get found online. No jargon, no big agency prices —
                            just hustling and doing it for the love of the game.
                        </p>

                        <Link
                            to="/studio"
                            className="inline-flex items-center gap-2
                         bg-white text-[#0b4e9d]
                         font-black text-[11px] uppercase tracking-[0.14em]
                         px-5 py-2.5 rounded-full
                         hover:bg-[#EAF0FB] transition-colors active:scale-95"
                        >
                            Get in touch <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </FadeUp>
            </div>

            {/* ── PULL QUOTE ────────────────────────────────────── */}
            <div className="px-5 pb-10">
                <div className="bg-[#EAF0FB] rounded-2xl p-5 border border-[#C8D8F0]">
                    <p className="text-[13px] text-[#0b4e9d] text-center leading-relaxed italic"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        "Every café has a story. This app just helps you find the one
                        that matches yours today."
                    </p>
                </div>
            </div>

            {/* ── CONTACT ME BUTTON ─────────────────────────────── */}
            <div className="px-5 pt-2 pb-10 flex justify-center">
                <FadeUp>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2.5
                                   bg-[#1E2020] text-white
                                   font-black text-[11px] uppercase tracking-[0.14em]
                                   px-8 py-3.5 rounded-full
                                   shadow-[0_4px_20px_rgba(30,32,32,0.20)]
                                   hover:bg-[#2E3030] hover:scale-105 transition-all
                                   active:scale-95"
                    >
                        Contact Me <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </FadeUp>
            </div>

        </div>
    );
};
