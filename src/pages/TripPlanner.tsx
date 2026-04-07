import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, Calendar, MapPin, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchMyTrips } from '../lib/tripApi';
import { TripCard } from '../components/trip/TripCard';
import { CreateTripModal } from '../components/trip/CreateTripModal';
import { TripDetailModal } from '../components/trip/TripDetailModal';
import type { Trip } from '../types/trip';

export const TripPlanner: React.FC = () => {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<Trip[]>([]);
  const [past, setPast] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const loadTrips = useCallback(async () => {
    try {
      const data = await fetchMyTrips();
      setUpcoming(data.upcoming);
      setPast(data.past);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleTripCreated = () => {
    loadTrips();
  };

  const handleTripUpdate = (updated: Trip) => {
    setSelectedTrip(updated);
    loadTrips();
  };

  const handleTripDelete = () => {
    setSelectedTrip(null);
    loadTrips();
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] pb-24">
      {/* Desktop home logo */}
      <Link to="/" className="hidden md:block fixed top-6 right-6 z-50">
        <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="Home"
          className="w-12 h-12 rounded-full object-cover shadow-[0_4px_24px_rgba(11,78,157,0.25)] border-2 border-white hover:scale-105 transition-transform cursor-pointer" />
      </Link>

      {/* Header */}
      <div className="px-5 pt-12 pb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A8B0A0] mb-3 block">
            Trip Planner
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1E2020] leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Plan a<br />
            <span className="relative">
              Cafe Trip
              <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 8" preserveAspectRatio="none">
                <motion.path
                  d="M0,5 Q25,1 50,5 Q75,9 100,5 Q125,1 150,5 Q175,9 200,5"
                  fill="none" stroke="#0b4e9d" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }} />
              </svg>
            </span>
          </h1>
          <p className="text-[14px] text-[#7A8478] leading-relaxed mt-4 max-w-sm">
            Pick a cafe, set a date, invite your friends. No more group chat chaos.
          </p>
        </motion.div>
      </div>

      <div className="px-5">
        <div className="h-px bg-[#D8DDD0]/60 mb-6" />
      </div>

      {/* Content */}
      <div className="px-5">
        {loading ? (
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-[#EAEEE8] h-28 animate-pulse" />
            ))}
          </div>
        ) : upcoming.length === 0 && past.length === 0 ? (
          /* Empty state */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 bg-[#EAF0FB] rounded-3xl flex items-center justify-center">
              <Coffee className="w-8 h-8 text-[#0b4e9d]" />
            </div>
            <h3 className="text-xl font-bold text-[#1E2020] mb-2"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic' }}>
              No trips yet
            </h3>
            <p className="text-[13px] text-[#7A8478] max-w-xs mx-auto leading-relaxed mb-6">
              Plan your first cafe trip and share the link with friends to get everyone on board.
            </p>
            <button onClick={() => setShowCreate(true)}
              className="inline-flex items-center gap-2 bg-[#0b4e9d] text-white font-bold text-[11px] uppercase tracking-[0.14em]
                px-6 py-3 rounded-full hover:bg-[#093d7a] active:scale-95 transition-all shadow-[0_4px_16px_rgba(11,78,157,0.25)]">
              <Plus className="w-3.5 h-3.5" /> Plan Your First Trip
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[13px] font-bold text-[#1E2020] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#0b4e9d]" />
                    Upcoming
                  </h2>
                  <span className="text-[10px] text-[#7A8478] font-medium">{upcoming.length} trip{upcoming.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="space-y-3">
                  {upcoming.map((trip, i) => (
                    <motion.div key={trip._id} initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <TripCard trip={trip} onClick={setSelectedTrip} currentUserId={user?.id} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Past */}
            {past.length > 0 && (
              <div>
                <h2 className="text-[13px] font-bold text-[#7A8478] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  Past Trips
                </h2>
                <div className="space-y-3">
                  {past.map((trip, i) => (
                    <motion.div key={trip._id} initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                      <TripCard trip={trip} onClick={setSelectedTrip} currentUserId={user?.id} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      {(upcoming.length > 0 || past.length > 0) && (
        <motion.button
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.4 }}
          onClick={() => setShowCreate(true)}
          className="fixed bottom-20 right-5 md:bottom-8 md:right-8 z-40
            w-14 h-14 bg-[#0b4e9d] text-white rounded-2xl shadow-[0_4px_20px_rgba(11,78,157,0.35)]
            flex items-center justify-center hover:bg-[#093d7a] active:scale-90 transition-all"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      )}

      {/* Modals */}
      <CreateTripModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={handleTripCreated}
      />

      <TripDetailModal
        trip={selectedTrip}
        isOpen={!!selectedTrip}
        onClose={() => setSelectedTrip(null)}
        onUpdate={handleTripUpdate}
        onDelete={handleTripDelete}
        currentUserId={user?.id}
      />
    </div>
  );
};
