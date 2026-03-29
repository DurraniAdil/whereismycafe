import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Mail, Github, Linkedin, MapPin,
    Code2, PenLine, Coffee, Users,
    ArrowRight, ArrowUpRight, Heart,
    Globe, Check, Loader2,
} from 'lucide-react';
import { useLogoClick } from '../hooks/useLogoClick';
import { useShare } from '../hooks/useShare';

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
    // Code — Full Stack
    { label: 'React.js', category: 'code' },
    { label: 'Next.js', category: 'code' },
    { label: 'TypeScript', category: 'code' },
    { label: 'Tailwind CSS', category: 'code' },
    { label: 'Framer Motion', category: 'code' },
    { label: 'Node.js', category: 'code' },
    { label: 'Express.js', category: 'code' },
    { label: 'PostgreSQL', category: 'code' },
    { label: 'MongoDB', category: 'code' },
    { label: 'Prisma', category: 'code' },
    { label: 'REST APIs', category: 'code' },
    { label: 'Firebase', category: 'code' },
    { label: 'Supabase', category: 'code' },
    { label: 'Auth & JWT', category: 'code' },
    { label: 'AI Integration', category: 'code' },
    { label: 'Figma', category: 'code' },

    // Content
    { label: 'SEO Writing', category: 'content' },
    { label: 'Copywriting', category: 'content' },
    { label: 'Poetry', category: 'content' },

    // Ops
    { label: 'Project Management', category: 'ops' },
    { label: 'Human Resources', category: 'ops' },
    { label: 'Local SEO', category: 'ops' },
    { label: 'Google Business', category: 'ops' },
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
        cta: 'Share it!',
        type: 'share',
    },
    {
        title: 'Explore the Studio',
        body: 'WIMC Studio is the engine behind this app. We build premium digital experiences for local cafes that want to stand out.',
        cta: 'Visit Studio',
        href: 'https://wimc-studio.vercel.app/',
    },
];

// ── Page ────────────────────────────────────────────────────
export const Contact: React.FC = () => {
    const handleLogoClick = useLogoClick();
    const { share, copied, sharing } = useShare();

    return (
        <div className="min-h-screen bg-[#F8F6F1] pb-8 relative">

            {/* Desktop home logo */}
            <Link to="/" className="hidden md:block absolute top-6 right-6 z-50">
                <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Home"
                    className="w-40 h-40 rounded-full object-cover border-2 border-white
                     shadow-[0_2px_10px_rgba(11,78,157,0.18)]
                     hover:scale-105 hover:shadow-[0_4px_18px_rgba(11,78,157,0.28)]
                     transition-all" />
            </Link>

            {/* ── HERO ──────────────────────────────────────────── */}
            <div className="px-5 pt-6 md:pt-12 pb-10">
                <FadeUp>

                    <h1 className="text-5xl font-bold text-[#1E2020] leading-[1.1] tracking-tight"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Let's build
                    </h1>
                    <p className="text-4xl font-normal italic text-[#A8B0A0] leading-tight mt-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        something real.
                    </p>

                    <p className="text-[14px] text-[#7A8478] leading-[1.8] mt-5 max-w-md">
                        Whether you're invisible on Google, need a website that actually ranks, want your café on WIMC, or just want to talk. Feel free to reach out. We'll figure it out together.
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
                        Durrani Adil
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
                            B.Tech CS from P.E.S College of Engineering. Currently Project Manager
                            and SDE at Be Endless and at the same time building things on the side that actually
                            mean something to this city.
                        </p>
                        <p className="text-[#FFFFFF] text-[14px] leading-relaxed">
                            Full Stack developer by craft. Poet by nature. The combination of
                            React.js and Sufi poetry shouldn't work as well as it does and yet it does.
                        </p>
                        <p className="text-[#FFFFFF] text-[14px] leading-relaxed">
                            Published in 3 international anthologies. 500+ original poems.
                            28 gold medals in writing and elocution. Builds authentication
                            systems and AI tools in the same hours when I am not overthinking a couplet.
                        </p>
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

                                {way.cta && (
                                    way.type === 'share' ? (
                                        <button
                                            onClick={() => share(undefined, 'Check this app out @ https://whereismycafe.vercel.app/')}
                                            disabled={sharing}
                                            className="inline-flex items-center gap-1.5 mt-4
                                   text-[11px] font-black uppercase tracking-[0.14em]
                                   text-[#0b4e9d] hover:gap-2.5 transition-all disabled:opacity-50"
                                        >
                                            {sharing ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : copied ? (
                                                <Check className="w-3 h-3" />
                                            ) : (
                                                null
                                            )}
                                            {copied ? 'Copied!' : way.cta}
                                            {!copied && !sharing && <ArrowRight className="w-3 h-3" />}
                                        </button>
                                    ) : way.href ? (
                                        <a href={way.href}
                                            target={way.href.startsWith('http') ? '_blank' : undefined}
                                            rel={way.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                                            className="inline-flex items-center gap-1.5 mt-4
                                   text-[11px] font-black uppercase tracking-[0.14em]
                                   text-[#0b4e9d] hover:gap-2.5 transition-all">
                                            {way.cta} <ArrowRight className="w-3 h-3" />
                                        </a>
                                    ) : null
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
