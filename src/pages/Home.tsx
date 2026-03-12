import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCafes } from '../lib/getCafes';
import { CafeCard } from '../components/CafeCard';
import { HomeHeader } from '../components/HomeHeader';
import { PageLoadingSkeleton } from '../components/PageLoadingSkeleton';
import { useDelayedLoading } from '../hooks/useDelayedLoading';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Cafe } from '../types/cafe';

const PER_PAGE = 9;

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [allCafes, setAllCafes] = useState<Cafe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllCafes()
      .then(setAllCafes)
      .catch((err) => setError(err.message || 'Failed to fetch cafes'))
      .finally(() => setLoading(false));
  }, []);

  const totalPages = Math.ceil(allCafes.length / PER_PAGE);
  const paginatedCafes = allCafes.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const showSkeleton = useDelayedLoading(loading);

  if (showSkeleton) return <PageLoadingSkeleton type="home" />;
  if (loading && allCafes.length === 0) return null; // Wait for initial fetch if no cache
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1] text-red-500 font-medium">
      {error}
    </div>
  );

  const scrollToAll = () => {
    document.getElementById('all-cafes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] pb-8">
      {/* Hero Header */}
      <HomeHeader onVibeSelect={(vibe) => navigate(`/search?vibe=${vibe}`)} />

      {/* ── All Cafes Section ───────────────────────────────── */}
      <main className="px-5 py-4 max-w-7xl mx-auto">
        <section id="all-cafes">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black text-[#1E2020] tracking-[-0.02em] italic">
              All Cafés <span className="not-italic font-medium text-lg text-[#7A8478]">({allCafes.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedCafes.map((cafe) => (
              <motion.div
                key={cafe.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.3 }}
              >
                <CafeCard cafe={cafe} />
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => { setPage(p => Math.max(1, p - 1)); scrollToAll(); }}
                disabled={page === 1}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-[#D8DDD0] text-[#1E2020] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#E8EBE4] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => { setPage(p); scrollToAll(); }}
                  className={`w-10 h-10 rounded-full text-sm font-semibold transition-all
                    ${p === page
                      ? 'bg-[#1E2020] text-white shadow-md'
                      : 'text-[#7A8478] hover:bg-[#E8EBE4] border border-[#D8DDD0]'
                    }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => { setPage(p => Math.min(totalPages, p + 1)); scrollToAll(); }}
                disabled={page === totalPages}
                className="w-10 h-10 rounded-full flex items-center justify-center border border-[#D8DDD0] text-[#1E2020] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#E8EBE4] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
