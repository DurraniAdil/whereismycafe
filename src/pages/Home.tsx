import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCafes, getCachedCafes } from '../lib/getCafes';
import { HomeHeader } from '../components/HomeHeader';
import { PageLoadingSkeleton } from '../components/PageLoadingSkeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import { CafeOfTheDay } from '../components/CafeOfTheDay';
import { MoodPicker } from '../components/MoodPicker';
import { Roulette } from '../components/Roulette';
import { motion } from 'motion/react';
import { Cafe } from '../types/cafe';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [allCafes, setAllCafes] = useState<Cafe[]>(getCachedCafes() || []);
  const [loading, setLoading] = useState(!getCachedCafes());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllCafes()
      .then(setAllCafes)
      .catch((err) => setError(err.message || 'Failed to fetch cafes'))
      .finally(() => setLoading(false));
  }, []);

  const showSkeleton = useDelayedLoading(loading);

  if (showSkeleton) return <PageLoadingSkeleton type="home" />;
  if (loading && allCafes.length === 0) return null;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1] text-red-500 font-medium">
      {error}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F6F1] pb-20">
      {/* Hero Header */}
      <HomeHeader onVibeSelect={(vibe) => navigate(`/search?vibe=${vibe}`)} />

      {/* Section Header: Here is your cafe today */}
      <div className="px-5 pt-8 mb-2 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-black text-[#1E2020] tracking-tight leading-none mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Here is your<br />
            <span className="relative">
              cafe for today!
            </span>
          </h2>
          <p className="text-sm text-[#7A8478] mt-3 font-medium italic"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Cafes of the day
          </p>
        </motion.div>
      </div>

      {/* Vibes Content Integrated into Home */}
      <main className="px-5 space-y-12 max-w-7xl mx-auto pt-6">
        {/* 1. Café of the Day */}
        <CafeOfTheDay cafes={allCafes} hideHeader={true} />

        {/* Thin divider */}
        <div className="h-px bg-[#D8DDD0]/60" />

        {/* 2. Mood Picker */}
        <MoodPicker cafes={allCafes} />

        {/* Thin divider */}
        <div className="h-px bg-[#D8DDD0]/60" />

        {/* 3. Roulette */}
        <Roulette cafes={allCafes} />
      </main>
    </div>
  );
};
