import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLogoClick } from '../hooks/useLogoClick';
import { ExternalLink, Star, Heart, MapPin, Coffee, Users, ChevronDown, Rocket } from 'lucide-react';

export const Studio: React.FC = () => {
    const handleLogoClick = useLogoClick();

    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        if (openFaq === index) setOpenFaq(null);
        else setOpenFaq(index);
    };

    const FOCUS_AREAS = [
        { icon: Coffee, title: "Curated Discovery", desc: "Finding the best spots for every vibe, from quiet work sessions to late-night hangouts." },
        { icon: Users, title: "Building Community", desc: "Connecting people through their shared love for coffee and conversation." },
        { icon: Heart, title: "Supporting Local", desc: "Giving independent cafés the visibility they deserve in our growing city." },
        { icon: MapPin, title: "Hyper-Local Focus", desc: "Built specifically for Aurangabad, celebrating our unique café culture." },
    ];

    const FAQS = [
        { q: "My café isn't on WIMC yet. How do I get listed?", a: "Just reach out! Hit me up through the links below, tell me a bit about your place, and I'll drop by to get you set up. It's that simple." },
        { q: "I need to update my café's info on the app. Can you help?", a: "Absolutely. Whether it's new photos, updated timings, or a menu change, just shoot me a message and I'll update it for you right away." },
        { q: "Are you open to building custom features or websites?", a: "Yes! While WIMC is my main focus, I do take on freelance web projects. If you need a website or custom tech for your business, we can chat about that too." },
        { q: "How much does it cost to be on the app?", a: "Getting listed on WIMC is completely free. My goal is to map the entire café scene." },
    ];

    return (
        <div className="min-h-screen bg-[#F8F6F1] pb-28 font-sans selection:bg-[#0b4e9d] selection:text-white">

            {/* Mobile logo */}
            <div className="md:hidden fixed top-6 right-6 z-50">
                <img src="/media/circle.png" alt="logo"
                    onClick={handleLogoClick}
                    className="w-12 h-12 rounded-full object-cover cursor-pointer 
                     border-2 border-white shadow-[0_2px_10px_rgba(11,78,157,0.18)]
                     hover:scale-105 transition-all" />
            </div>

            {/* Desktop Back Logo */}
            <Link to="/" className="hidden md:block fixed top-6 right-6 z-50">
                <img src="/media/circle.png" alt="Home"
                    className="w-12 h-12 rounded-full object-cover shadow-[0_4px_24px_rgba(11,78,157,0.25)] border-2 border-white hover:scale-105 transition-transform cursor-pointer" />
            </Link>


            {/* ── HERO ──────────────────────────────────────────── */}
            <div className="px-5 pt-20 pb-16 md:pt-32 md:pb-24 text-center relative overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="relative z-10 max-w-2xl mx-auto"
                >

                    <h1 className="text-6xl md:text-8xl font-black text-[#0b4e9d] leading-[1.1] tracking-tight italic mb-6"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        WIMC Studio
                    </h1>

                    <p className="text-xl md:text-2xl font-bold text-[#1E2020] mb-6">
                        More than just an app. A community project.
                    </p>

                    <p className="text-[15px] md:text-lg text-[#7A8478] leading-relaxed max-w-lg mx-auto mb-10">
                        Going to a café is no longer just about coffee—it's become a core part of our city's culture. WIMC Studio is my vision to bring the community together and celebrate the spaces that make this city feel like home.
                    </p>

                    <a href="https://wimc-studio.vercel.app/" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#0b4e9d] text-white
                                   px-8 py-4 rounded-full font-bold shadow-[0_8px_24px_rgba(11,78,157,0.35)]
                                   hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(11,78,157,0.45)] transition-all">
                        <span>Say Hello</span>
                        <ExternalLink className="w-5 h-5" />
                    </a>
                </motion.div>


            </div>

            {/* ── DIVIDER ───────────────────────────────────────── */}
            <div className="px-5 max-w-4xl mx-auto"><div className="h-px bg-[#D8DDD0]/60" /></div>

            {/* ── THE COMMUNITY VISION ────────────────────────────────── */}
            <div className="px-5 py-20 max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-black text-[#1E2020] leading-tight italic mb-3"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        The Vision
                    </h2>
                    <p className="text-[15px] text-[#7A8478]">
                        Why I'm building this platform.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {FOCUS_AREAS.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl border border-[#EAEEE8] p-8 hover:border-[#0b4e9d]/30 transition-colors shadow-sm group"
                            >
                                <div className="w-12 h-12 bg-[#0b4e9d]/10 rounded-2xl flex items-center justify-center mb-5 text-[#0b4e9d] group-hover:scale-110 transition-transform">
                                    <Icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-lg font-bold text-[#1E2020] mb-2">{item.title}</h3>
                                <p className="text-[14px] text-[#7A8478] leading-relaxed">{item.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ── JOIN THE APP CTA ──────────────────────────────────── */}
            <div className="px-5 py-20 bg-white max-w-5xl mx-auto md:rounded-3xl border border-[#EAEEE8] shadow-sm mb-20 text-center">
                <div className="max-w-2xl mx-auto">
                    <div className="inline-flex flex-col items-center justify-center w-16 h-16 bg-[#0b4e9d]/10 text-[#0b4e9d] rounded-full mb-6 relative">

                        <Rocket className="w-7 h-7" />
                    </div>

                    <h2 className="text-4xl md:text-5xl font-black text-[#1E2020] leading-tight italic mb-6"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Get Your Café Listed
                    </h2>
                    <p className="text-[16px] text-[#7A8478] leading-relaxed mb-8">
                        Is your café missing from the app? Or do you need to update some details, like new photos or a info tweak? Just hit me up. Talk me through what you need, I'll drop by your café, and bam—you'll be all set up. No hassle.
                    </p>

                    <a href="https://wimc-studio.vercel.app/" target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#1E2020] text-white
                                   px-8 py-4 rounded-full font-bold shadow-[0_8px_24px_rgba(30,32,32,0.3)]
                                   hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(30,32,32,0.4)] transition-all">
                        <span>Get In Touch</span>
                        <ChevronRight className="w-4 h-4 ml-1" />
                    </a>
                </div>
            </div>

            {/* ── BUILDER CARD ──────────────────────────────────── */}
            <div className="px-5 max-w-4xl mx-auto mb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-[#EAEEE8] bg-white shadow-sm"
                >
                    <div className="bg-[#0b4e9d] p-10 flex flex-col justify-between text-white relative overflow-hidden">
                        {/* subtle glowing orbital */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-4 block">
                                THE BUILDER {'<3'}
                            </span>
                            <h2 className="text-5xl md:text-6xl font-black italic leading-[1.1] mb-2"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                Hi, I'm <br /> Adil.
                            </h2>
                        </div>

                        <div className="mt-16 pt-8 border-t border-white/20">
                            <h4 className="text-lg font-bold">Building the WIMC UI</h4>
                            <p className="text-[12px] text-white/80 mt-1 font-medium italic">Crafting experiences that work.</p>
                        </div>
                    </div>

                    <div className="p-10 md:p-12 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-[#A8B0A0] mb-6 border-b border-[#EAEEE8] pb-4">
                            <MapPin className="w-4 h-4" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Aurangabad, India</span>
                        </div>

                        <p className="text-xl md:text-2xl font-bold text-[#1E2020] mb-6 italic"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            "Local boy tries to bring <br /> café goers together."
                        </p>

                        <p className="text-[14px] text-[#7A8478] leading-relaxed mb-8">
                            This whole project started because I love the café culture here and wanted to build something for the community. Alongside WIMC, I'm also open to taking on other creative freelance web gigs. It's all part of growing the Studio ecosystem.
                        </p>

                        <a href="https://wimc-studio.vercel.app/" target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-[#F0F4FA] text-[#0b4e9d]
                                      px-6 py-3 rounded-full font-bold hover:bg-[#E2EAF4] transition-colors self-start">
                            <span>More About Studio</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* ── FAQ ────────────────────────────────────────────── */}
            <div className="px-5 pb-20 max-w-2xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-black text-[#1E2020] leading-tight italic mb-3"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Questions?
                    </h2>
                    <p className="text-[15px] text-[#7A8478]">
                        Some common questions about the Studio.
                    </p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-[#EAEEE8] overflow-hidden transition-all shadow-sm">
                            <button
                                onClick={() => toggleFaq(i)}
                                className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:bg-[#EAF0FB]"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] font-black uppercase text-[#A8B0A0]">{(i + 1).toString().padStart(2, '0')}</span>
                                    <span className="text-[14px] font-bold text-[#1E2020]">{faq.q}</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 text-[#A8B0A0] transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="p-5 pt-0 text-[14px] text-[#7A8478] leading-relaxed pl-[3.25rem]">
                                            {faq.a}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FOOTER CTA ──────────────────────────────────────── */}
            <div className="px-5 text-center my-10 relative">
                <a href="https://wimc-studio.vercel.app/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#EAF0FB] border border-[#0b4e9d]/20 text-[#0b4e9d]
                                   px-8 py-4 rounded-full font-bold shadow-sm
                                   hover:-translate-y-1 hover:shadow-md hover:bg-[#E2EAF4] transition-all">
                    <span>Visit The Studio Webpage</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                </a>
            </div>

        </div>
    );
};

// Add ChevronRight icon component
function ChevronRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
