import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { useLogoClick } from '../hooks/useLogoClick';
import {
    ExternalLink, MapPin, Coffee, Users, Heart,
    Search, Star, ChevronDown, ArrowUpRight
} from 'lucide-react';

export const Studio: React.FC = () => {
    const handleLogoClick = useLogoClick();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const toggleFaq = (i: number) => setOpenFaq(openFaq === i ? null : i);

    const SERVICES = [
        { icon: Search, title: "Google Business Profile", desc: "Set up, verified, and fully optimized so you show up on Search and Maps.", soon: false },
        { icon: MapPin, title: "Local SEO", desc: "Rank in the local pack — the top 3 results when someone searches 'near me'.", soon: false },
        { icon: Star, title: "Review Growth", desc: "A strategy to get real reviews from real customers. More reviews, better rankings.", soon: false },
        { icon: Coffee, title: "Website + Landing Page", desc: "Fast, mobile-first, SEO-structured. Turns visitors into walk-ins.", soon: false },
        { icon: Users, title: "Social Visibility", desc: "Instagram, Google Posts, and local presence — set up and optimized.", soon: false },
        { icon: Heart, title: "AI Automation", desc: "Automated review replies, customer messaging, and retention flows.", soon: true },
    ];

    const FAQS = [
        { q: "What exactly is a Google Business Profile?", a: "It's the listing that shows up when someone searches your business on Google — with your photos, hours, location, reviews, and a button to call or get directions. It's the single most important thing for local visibility, and most small businesses in Aurangabad either don't have one or have one that's incomplete." },
        { q: "Will this work for my type of business?", a: "If you're a local business that wants more customers — café, restaurant, bakery, salon, boutique, clinic, studio — yes. We started with cafés but the visibility system works for any local business." },
        { q: "How long does it take to set everything up?", a: "Google Business Profile setup and basic local SEO takes 3–5 days. A full website takes 5–7 days. Monthly management is ongoing. We move fast." },
        { q: "Do I need to be in Aurangabad?", a: "Aurangabad is where we're from and where we know the market best. But we work with local businesses across Maharashtra and beyond — the visibility system works anywhere." },
        { q: "What's the AI automation coming soon?", a: "We're building tools that let cafés automate review responses, answer customer FAQs, send follow-up messages, and run retention campaigns — without lifting a finger. It rolls out to Studio clients first." },
    ];

    return (
        <div className="min-h-screen bg-[#F8F6F1] pb-12 font-sans selection:bg-[#0b4e9d] selection:text-white">

            {/* Logo */}
            <div className="md:hidden fixed top-6 right-6 z-50">
                <img src="/media/circle.png" alt="logo" onClick={handleLogoClick}
                    className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-white
                    shadow-[0_2px_10px_rgba(11,78,157,0.18)] hover:scale-105 transition-all" />
            </div>
            <Link to="/" className="hidden md:block fixed top-6 right-6 z-50">
                <img src="/media/circle.png" alt="Home"
                    className="w-12 h-12 rounded-full object-cover shadow-[0_4px_24px_rgba(11,78,157,0.25)]
                    border-2 border-white hover:scale-105 transition-transform cursor-pointer" />
            </Link>

            <div className="px-4 sm:px-6 max-w-5xl mx-auto pt-20 md:pt-28 space-y-4">

                {/* ── HERO BENTO ROW ─────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    {/* Hero — spans 3 cols */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="md:col-span-3 bg-white border border-[#EAEEE8] rounded-3xl p-8 md:p-10 
                        flex flex-col justify-between relative overflow-hidden min-h-[320px] shadow-sm"
                    >
                        <div className="absolute -top-16 -right-16 w-64 h-64" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A8B0A0]">
                            WIMC Studio
                        </span>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-[#1E2020] leading-[1.1]
                                tracking-tight italic mb-4"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                We put your business on the map.
                            </h1>
                            <a href="https://wimc-studio.vercel.app/" target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#0b4e9d] text-white
                                px-6 py-3 rounded-full font-bold text-[13px]
                                hover:-translate-y-0.5 hover:shadow-lg transition-all mt-2">
                                Get Your Business Visible <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </motion.div>

                    {/* Problem — spans 2 cols */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        className="md:col-span-2 bg-white rounded-3xl border border-[#EAEEE8] p-8
                        flex flex-col justify-between shadow-sm min-h-[320px]"
                    >
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A8B0A0]">
                            The Problem
                        </span>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#1E2020] leading-tight italic mb-4"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                Most local businesses are invisible online.
                            </h2>
                            <p className="text-[13px] text-[#7A8478] leading-relaxed">
                                No Google profile, incomplete listing, or a website nobody finds.
                                Customers search — find someone else — and walk in there instead.
                                Every day. Silently.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* ── BUILDER BENTO ROW ──────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-1 gap-4"
                >
                    <div className="bg-white rounded-3xl border border-[#EAEEE8] overflow-hidden shadow-sm flex flex-col md:flex-row">
                        {/* Blue side */}
                        <div className="md:w-2/5 bg-[#0b4e9d] p-8 flex flex-col justify-between text-white relative overflow-hidden min-h-[260px]">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full
                                blur-[60px] -translate-y-1/2 translate-x-1/2" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                                THE BUILDER {'<3'}
                            </span>
                            <div>
                                <h2 className="text-5xl font-black italic leading-[1.1] mb-2"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    Hi, I'm Adil.
                                </h2>
                                <div className="pt-5 mt-5 border-t border-white/20">
                                    <p className="text-[12px] text-white/70 italic">Building the WIMC UI</p>
                                </div>
                            </div>
                        </div>

                        {/* Bio side */}
                        <div className="flex-1 p-8 flex flex-col justify-center">
                            <div className="flex items-center gap-2 text-[#A8B0A0] mb-5 pb-4 border-b border-[#EAEEE8]">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                                    Aurangabad, India
                                </span>
                            </div>
                            <p className="text-xl md:text-2xl font-bold text-[#1E2020] mb-4 italic"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                "Local boy tries to put the locals on the map."
                            </p>
                            <p className="text-[13px] text-[#7A8478] leading-relaxed mb-6">
                                Started WIMC because I love the café culture here. Realized the problem
                                wasn't just discovery for users — it was invisibility for the businesses.
                                So I built a studio around fixing that.
                            </p>
                            <a href="https://wimc-studio.vercel.app/" target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#F0F4FA] text-[#0b4e9d]
                                px-5 py-2.5 rounded-full font-bold text-[13px]
                                hover:bg-[#E2EAF4] transition-colors self-start">
                                More About Studio <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* ── SERVICES BENTO GRID ─────────────────────────── */}
                <div>
                    <div className="mb-6 pt-4">
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A8B0A0]">
                            What We Do
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-[#1E2020] leading-tight italic mt-1"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            The Visibility System
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* First card — wide */}
                        {SERVICES.map((item, i) => {
                            const Icon = item.icon;
                            // Make first card span 2 cols, and AI Automation (the last one) span all 3
                            const isFirst = i === 0;
                            const isLast = i === SERVICES.length - 1;

                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.06 }}
                                    className={`bg-white rounded-3xl border border-[#EAEEE8] p-7
                                        hover:border-[#0b4e9d]/30 transition-colors shadow-sm group
                                        relative flex flex-col justify-between
                                        ${isFirst ? 'col-span-2 md:col-span-2' : ''}
                                        ${isLast ? 'col-span-2 md:col-span-3' : 'col-span-1'}`}
                                >
                                    {item.soon && (
                                        <span className="absolute top-5 right-5 text-[9px] font-black uppercase
                                            tracking-[0.15em] text-[#0b4e9d]/60 bg-[#EBF1FB] px-2 py-1 rounded-full">
                                            Soon
                                        </span>
                                    )}
                                    <div className="w-10 h-10 bg-[#0b4e9d]/10 rounded-xl flex items-center
                                        justify-center mb-4 text-[#0b4e9d] group-hover:scale-110 transition-transform">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-[14px] font-bold text-[#1E2020] mb-1.5">{item.title}</h3>
                                        <p className="text-[12px] text-[#7A8478] leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* ── WIMC PROOF BENTO ROW ────────────────────────── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-5 gap-4"
                >
                    {/* Next Frontier */}
                    <div className="md:col-span-2 bg-[#F8F7F4] rounded-3xl border border-[#EAEEE8] p-8 flex flex-col 
                        justify-between shadow-sm relative overflow-hidden min-h-[320px]">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#0b4e9d]/5 rounded-full blur-[40px]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#A8B0A0]">
                            The Next Frontier
                        </span>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-[#1E2020] leading-tight italic mb-4"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                We're just getting started.
                            </h2>
                            <p className="text-[13px] text-[#7A8478] leading-relaxed">
                                We mapped Aurangabad's cafés first. Soon, the WIMC visibility system
                                moves to restaurants, clinics, bakeries, salons, boutiques, and every
                                local business that deserves to be found.
                            </p>
                        </div>
                        <div className="pt-4 mt-auto">
                            <span className="text-[11px] font-bold text-[#0b4e9d]">Building for the whole city.</span>
                        </div>
                    </div>

                    {/* Proof copy */}
                    <div className="md:col-span-3 bg-[#0b4e9d] rounded-3xl p-8 md:p-10 flex flex-col
                        justify-between text-white relative overflow-hidden">
                        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#0b4e9d]/20 rounded-full blur-[60px]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/40">
                            The Proof
                        </span>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight italic mb-4"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                WIMC Studio is the engine behind Aurangabad's favorite discovery app.
                            </h2>
                            <p className="text-[13px] text-white/60 leading-relaxed mb-6">
                                We don't just talk about visibility — we built the platform that thousands
                                of locals use to find their next spot. We know the city, we know the tech,
                                and we know how to get your business seen.
                            </p>
                            <a href="https://wimc-studio.vercel.app/" target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-[#1E2020]
                                px-5 py-2.5 rounded-full font-bold text-[13px]
                                hover:bg-[#F8F7F4] transition-colors shadow-lg">
                                Work With The Studio <ArrowUpRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* ── FAQ ─────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

                    {/* FAQ label col */}
                    <div className="md:col-span-2 bg-[#0b4e9d] rounded-3xl p-8 flex flex-col justify-between
                        relative overflow-hidden">
                        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-[60px]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/60">
                            FAQ
                        </span>
                        <div>
                            <h2 className="text-4xl font-black text-white leading-tight italic mb-3"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                Questions?
                            </h2>
                            <p className="text-[13px] text-white/60 leading-relaxed mb-6">
                                The ones we get asked most.
                            </p>
                            <a href="https://wimc-studio.vercel.app/" target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white text-[#0b4e9d]
                                px-5 py-2.5 rounded-full font-bold text-[13px]
                                hover:-translate-y-0.5 transition-all">
                                Visit The Studio <ArrowUpRight className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* FAQ accordion col */}
                    <div className="md:col-span-3 space-y-3">
                        {FAQS.map((faq, i) => (
                            <div key={i}
                                className="bg-white rounded-2xl border border-[#EAEEE8] overflow-hidden shadow-sm">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-5 text-left
                                        focus:outline-none focus-visible:bg-[#EAF0FB]"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black uppercase text-[#A8B0A0] flex-shrink-0">
                                            {(i + 1).toString().padStart(2, '0')}
                                        </span>
                                        <span className="text-[13px] font-bold text-[#1E2020]">{faq.q}</span>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 text-[#A8B0A0] flex-shrink-0 ml-3
                                        transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                        >
                                            <div className="px-5 pb-5 text-[13px] text-[#7A8478]
                                                leading-relaxed pl-[2.75rem]">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};
