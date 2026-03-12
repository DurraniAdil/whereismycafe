import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllCafes, getCachedCafes } from '../lib/getCafes';
import { motion } from 'motion/react';
import { CafeOfTheDay } from '../components/CafeOfTheDay';
import { MoodPicker } from '../components/MoodPicker';
import { Roulette } from '../components/Roulette';
import { Cafe } from '../types/cafe';
import { PageLoadingSkeleton } from '../components/PageLoadingSkeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';

// ─────────────────────────────────────────────────────────────
// VIBE PAGE
// ─────────────────────────────────────────────────────────────

export const Vibes: React.FC = () => {
    const [cafes, setCafes] = useState<Cafe[]>(getCachedCafes() || []);
    const [loading, setLoading] = useState(!getCachedCafes());
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getAllCafes()
            .then(setCafes)
            .catch((err) => setError(err.message || 'Failed to load'))
            .finally(() => setLoading(false));
    }, []);

    const showSkeleton = useDelayedLoading(loading);

    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
    if (showSkeleton) return <PageLoadingSkeleton type="vibes" />;
    if (loading && cafes.length === 0) return null;

    return (
        <div className="min-h-screen bg-[#F8F6F1] pb-8">

            {/* Desktop back button */}
            <Link to="/" className="fixed top-6 right-6 z-50">
                <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Home" className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-white hover:scale-105 transition-transform" />
            </Link>

            {/* Header */}
            <div className="px-5 pt-10 pb-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-4xl font-bold text-[#1E2020] tracking-tight leading-tight">
                        Find your<br />
                        <span className="font-serif italic text-[#7A8478]">next café.</span>
                    </h1>
                </motion.div>
            </div>

            {/* Sections */}
            <div className="px-5 space-y-10">

                {/* 1. Café of the Day */}
                <CafeOfTheDay cafes={cafes} />

                {/* Thin divider */}
                <div className="h-px bg-[#D8DDD0]/60" />

                {/* 2. Mood Picker */}
                <MoodPicker cafes={cafes} />

                {/* Thin divider */}
                <div className="h-px bg-[#D8DDD0]/60" />

                {/* 3. Roulette */}
                <Roulette cafes={cafes} />

            </div>
        </div>
    );
};
