import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Mail, Github, Linkedin, MapPin,
    Code2, PenLine, Coffee, Users,
    ArrowRight, ArrowUpRight, Heart,
    Globe,
} from 'lucide-react';
import { useLogoClick } from '../hooks/useLogoClick';

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
const stats = [
    { icon: Coffee, value: '65+', label: 'Cafés curated' },
    { icon: Code2, value: '10+', label: 'Dev projects' },
    { icon: PenLine, value: '500+', label: 'Original poems' },
    { icon: Users, value: '28', label: 'Gold medals' },
];

const skills = [
    { label: 'React.js', category: 'code' },
    { label: 'TypeScript', category: 'code' },
    { label: 'Next.js', category: 'code' },
    { label: 'Tailwind CSS', category: 'code' },
    { label: 'Framer Motion', category: 'code' },
    { label: 'Node.js', category: 'code' },
    { label: 'Firebase', category: 'code' },
    { label: 'Figma', category: 'code' },
    { label: 'SEO Writing', category: 'content' },
    { label: 'Copywriting', category: 'content' },
    { label: 'Poetry', category: 'content' },
    { label: 'Project Management', category: 'ops' },
    { label: 'Human Resources', category: 'ops' },
];

const categoryColor: Record<string, string> = {
    code: 'bg-[#EAF0FB] text-[#0b4e9d]    border-[#C8D8F0]',
    design: 'bg-violet-50 text-violet-700    border-violet-100',
    content: 'bg-amber-50  text-amber-700     border-amber-100',
    ops: 'bg-emerald-50 text-emerald-700  border-emerald-100',
};

const contactLinks = [
    {
        icon: Mail,
        label: 'durraniadil13@gmail.com',
        sub: 'Best way to reach me',
        href: 'mailto:durraniadil13@gmail.com?subject=Hey Adil! Let\'s talk about WIMC.&body=Hey Adil,%0A%0AI wanted to reach out regarding...',
        external: false,
    },
    {
        icon: Globe,
        label: 'Portfolio',
        sub: 'Check out my Portfolio',
        href: 'https://durraniadil.github.io/Portfolio-Portal/',
        external: true,
    },
    {
        icon: Linkedin,
        label: 'LinkedIn',
        sub: 'Professional Networking',
        href: 'https://www.linkedin.com/in/durraniadil13/',
        external: true,
    },
];

const collaborationWays = [
    {
        title: 'Submit a café',
        body: 'Know a spot that deserves to be on here? Send me the name, area, and vibe — I\'ll verify and add it.',
        cta: 'Send a suggestion',
        href: 'mailto:durraniadil13@gmail.com?subject=Café Suggestion',
    },
    {
        title: 'Contribute to the cause',
        body: 'This project is open for collaborators. If you want to help build this for our city — let\'s connect.',
        cta: 'Open LinkedIn',
        href: 'https://linkedin.com/in/durraniadil13',
    },
    {
        title: 'Share it around',
        body: 'No code needed. Just tell a friend who\'s looking for a quiet corner to study or somewhere nice for a date.',
        cta: null,
        href: null,
    },
];

// ── Page ────────────────────────────────────────────────────
export const Contact: React.FC = () => {
    const handleLogoClick = useLogoClick();

    return (
        <div className="min-h-screen bg-[#F8F6F1] pb-8">

            {/* Desktop home logo */}
            <Link to="/" className="hidden md:block fixed top-6 right-6 z-50">
                <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Home"
                    className="w-12 h-12 rounded-full object-cover border-2 border-white
                     shadow-[0_2px_10px_rgba(11,78,157,0.18)]
                     hover:scale-105 hover:shadow-[0_4px_18px_rgba(11,78,157,0.28)]
                     transition-all" />
            </Link>

            <div className="flex justify-center mb-8 md:hidden">
                <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="logo" onClick={handleLogoClick}
                    className="w-24 h-24 rounded-full object-cover shadow-[0_4px_24px_rgba(11,78,157,0.25)] border-4 border-white cursor-pointer hover:scale-105 transition-transform" />
            </div>
            {/* Mobile easter-egg logo */}
            <img src="/media/circle.png" alt="logo" onClick={handleLogoClick}
                className="md:hidden fixed top-6 right-6 z-50 w-12 h-12 rounded-full
                   object-cover cursor-pointer border-2 border-white
                   shadow-[0_2px_10px_rgba(11,78,157,0.18)]
                   hover:scale-105 transition-transform" />

            {/* ── HERO ──────────────────────────────────────────── */}
            <div className="px-5 pt-12 pb-10">
                <FadeUp>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]
                           text-[#A8B0A0] mb-4 block">
                        Contact
                    </span>

                    <h1 className="text-5xl font-bold text-[#1E2020] leading-[1.1] tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Let's build
                    </h1>
                    <p className="text-4xl font-normal italic text-[#A8B0A0] leading-tight mt-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        something real.
                    </p>

                    <p className="text-[14px] text-[#7A8478] leading-[1.8] mt-5 max-w-md">
                        Whether you want your café listed, need a website built, want to
                        collaborate on the project, or just want to say hi — the door's
                        always open.
                    </p>
                </FadeUp>
            </div>

            <div className="px-5"><div className="h-px bg-[#D8DDD0]/60" /></div>

            {/* ── WHO I AM ──────────────────────────────────────── */}
            <div className="px-5 py-10">
                <FadeUp>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]
                           text-[#A8B0A0] mb-4 block">
                        Who you're contacting
                    </span>
                    <h2 className="text-3xl font-bold text-[#1E2020] tracking-tight leading-tight mb-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Durrani Adil Khan
                    </h2>
                    <div className="flex items-center gap-1.5 mb-6">
                        <MapPin className="w-3.5 h-3.5 text-[#A8B0A0]" />
                        <span className="text-[11px] text-[#A8B0A0] font-bold uppercase tracking-wider">
                            Aurangabad, Maharashtra
                        </span>
                    </div>
                </FadeUp>

                <FadeUp delay={0.1}>
                    <div className="bg-[#0b4e9d] rounded-3xl border border-[#EAEEE8]
                          shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6 space-y-3 mb-5">
                        <p className="text-[#FFFFFF] text-[14px] leading-relaxed">
                            B.Tech Computer Science graduate from P.E.S College of Engineering— currently
                            working as a Project Manager/SDE at Be Endless while building things
                            on the side that actually matter to this city.
                        </p>
                        <p className="text-[#FFFFFF] text-[14px] leading-relaxed">
                            Front-end developer by craft, poet by nature, project manager by
                            circumstance. The unholy combination of React.js and Sufi poetry
                            is exactly what it sounds like — and somehow it works.
                        </p>
                        <p className="text-[#FFFFFF] text-[14px] leading-relaxed">
                            Published in 3 international anthologies. 500+ original poems.
                            28 gold medals in writing and elocution. Also builds authentication
                            systems and AI tools when not overthinking a couplet.
                        </p>
                    </div>
                </FadeUp>
            </div>

            {/* ── STATS ─────────────────────────────────────────── */}
            <div className="px-5 pb-10">
                <FadeUp>
                    <div className="grid grid-cols-2 gap-3">
                        {stats.map(({ icon: Icon, value, label }, i) => (
                            <motion.div key={label}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.35 }}
                                className="bg-white rounded-2xl border border-[#EAEEE8]
                           shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-4 flex flex-col gap-2">
                                <Icon className="w-4 h-4 text-[#0b4e9d]" />
                                <p className="text-2xl font-bold text-[#1E2020] leading-none"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    {value}
                                </p>
                                <p className="text-[11px] text-[#A8B0A0] font-bold uppercase tracking-wider">
                                    {label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </FadeUp>
            </div>

            {/* ── SKILLS ────────────────────────────────────────── */}
            <div className="px-5 pb-10">
                <FadeUp>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]
                         text-[#A8B0A0] mb-4">
                        What I work with
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills.map((skill, i) => (
                            <motion.span key={skill.label}
                                initial={{ opacity: 0, scale: 0.88 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04, duration: 0.2 }}
                                className={`text-[11px] font-bold uppercase tracking-wider
                            px-3 py-1.5 rounded-full border
                            ${categoryColor[skill.category]}`}>
                                {skill.label}
                            </motion.span>
                        ))}
                    </div>
                </FadeUp>
            </div>

            <div className="px-5"><div className="h-px bg-[#D8DDD0]/60" /></div>

            {/* ── REACH OUT ─────────────────────────────────────── */}
            <div className="px-5 py-10">
                <FadeUp>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]
                         text-[#A8B0A0] mb-5">
                        Reach out
                    </h3>
                </FadeUp>

                <div className="space-y-3">
                    {contactLinks.map(({ icon: Icon, label, sub, href, external }, i) => (
                        <FadeUp key={label} delay={i * 0.08}>
                            <a href={href}
                                target={external ? '_blank' : undefined}
                                rel={external ? 'noopener noreferrer' : undefined}
                                className="flex items-center gap-4 bg-white rounded-2xl
                           border border-[#EAEEE8] px-5 py-4
                           hover:border-[#0b4e9d]/25
                           hover:shadow-[0_4px_16px_rgba(11,78,157,0.10)]
                           transition-all group">
                                <div className="w-10 h-10 rounded-xl bg-[#EAF0FB] flex-shrink-0
                                flex items-center justify-center
                                group-hover:bg-[#0b4e9d] transition-colors duration-200">
                                    <Icon className="w-4 h-4 text-[#0b4e9d]
                                   group-hover:text-white transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[13px] font-bold text-[#1E2020] truncate
                                group-hover:text-[#0b4e9d] transition-colors">
                                        {label}
                                    </p>
                                    <p className="text-[11px] text-[#A8B0A0] font-medium mt-0.5 truncate">
                                        {sub}
                                    </p>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-[#C8D0C8] flex-shrink-0
                                         group-hover:text-[#0b4e9d] transition-colors" />
                            </a>
                        </FadeUp>
                    ))}
                </div>
            </div>

            <div className="px-5"><div className="h-px bg-[#D8DDD0]/60" /></div>

            {/* ── COLLAB SECTION ────────────────────────────────── */}
            <div className="px-5 pt-10 pb-4">
                <FadeUp>
                    {/* Header */}
                    <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]
                             text-[#A8B0A0] block mb-3">
                            For the city
                        </span>
                        <h2 className="text-[26px] font-bold text-[#1E2020] leading-[1.15]"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            This isn't just
                        </h2>
                        <p className="text-[26px] font-normal italic text-[#0b4e9d] leading-[1.15]"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            my project.
                        </p>
                        <p className="text-[14px] text-[#7A8478] leading-[1.8] mt-4">
                            Aurangabad — Sambhajinagar — whatever you call it, it's ours.
                            This city has culture, has history, has incredible cafés that
                            nobody's ever written up properly. That changes with everyone
                            who contributes — a suggestion, a share, a line of code.
                        </p>
                    </div>
                </FadeUp>

                {/* Collab cards */}
                <div className="space-y-3 mt-7">
                    {collaborationWays.map((way, i) => (
                        <FadeUp key={way.title} delay={i * 0.1}>
                            <div className="bg-white rounded-2xl border border-[#EAEEE8]
                              shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        {/* Number + title */}
                                        <div className="flex items-center gap-2.5 mb-2">
                                            <span className="text-[10px] font-black text-[#0b4e9d]/40
                                       tabular-nums tracking-wider">
                                                0{i + 1}
                                            </span>
                                            <h4 className="text-[14px] font-bold text-[#1E2020] italic"
                                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                                {way.title}
                                            </h4>
                                        </div>
                                        <p className="text-[13px] text-[#7A8478] leading-relaxed">
                                            {way.body}
                                        </p>
                                    </div>
                                </div>

                                {way.cta && way.href && (
                                    <a href={way.href}
                                        target={way.href.startsWith('http') ? '_blank' : undefined}
                                        rel={way.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                        className="inline-flex items-center gap-1.5 mt-4
                               text-[11px] font-black uppercase tracking-[0.14em]
                               text-[#0b4e9d] hover:gap-2.5 transition-all">
                                        {way.cta} <ArrowRight className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </FadeUp>
                    ))}
                </div>

                {/* Closing note */}
                <FadeUp delay={0.3}>
                    <div className="mt-8 mb-2 flex flex-col items-center gap-3 px-4 text-center">
                        {[
                            'No investment needed.',
                            'No grand plan required.',
                            "Just people from here, caring about here — that's how cities get their stories told.",
                        ].map((line, i) => (
                            <p key={i} className="text-[14px] text-[#A8B0A0] italic leading-relaxed max-w-[280px]"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                {line}
                            </p>
                        ))}
                        <Heart className="w-5 h-5 text-[#0b4e9d]/30 mt-3" />
                    </div>
                </FadeUp>

            </div>

        </div>
    );
};
