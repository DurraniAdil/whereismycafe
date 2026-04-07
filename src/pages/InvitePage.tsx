import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ExternalLink, Check, Copy, Users, LogIn } from 'lucide-react';
import { fetchTripByCode, rsvpTrip, voteOnPoll } from '../lib/tripApi';
import { useAuth } from '../context/AuthContext';
import type { Trip } from '../types/trip';

const RSVP_BUTTONS = [
  { status: 'going' as const, label: 'Going', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', active: 'bg-emerald-500 border-emerald-500 text-white' },
  { status: 'maybe' as const, label: 'Maybe', cls: 'bg-amber-50 border-amber-200 text-amber-700', active: 'bg-amber-500 border-amber-500 text-white' },
  { status: 'declined' as const, label: "Can't make it", cls: 'bg-red-50 border-red-200 text-red-600', active: 'bg-red-500 border-red-500 text-white' },
];

const RSVP_DOT: Record<string, string> = {
  going: 'bg-emerald-500', maybe: 'bg-amber-400', declined: 'bg-red-400', pending: 'bg-gray-300',
};

export const InvitePage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { user, isAuthenticated, setShowAuthModal } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    fetchTripByCode(code)
      .then(data => setTrip(data.trip))
      .catch(() => setError('Trip not found or link is invalid.'))
      .finally(() => setLoading(false));
  }, [code]);

  const handleRsvp = async (status: 'going' | 'maybe' | 'declined') => {
    if (!trip || !isAuthenticated) return;
    setActionLoading(`rsvp-${status}`);
    try {
      const updated = await rsvpTrip(trip._id, status);
      setTrip(updated);
    } catch (err) {
      console.error(err);
    }
    setActionLoading('');
  };

  const handleVote = async (cafeId: string) => {
    if (!trip || !isAuthenticated) return;
    setActionLoading(`vote-${cafeId}`);
    try {
      const updated = await voteOnPoll(trip._id, cafeId);
      setTrip(updated);
    } catch (err) {
      console.error(err);
    }
    setActionLoading('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[#0b4e9d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#1E2020] mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Trip Not Found
          </h1>
          <p className="text-[14px] text-[#7A8478] mb-6">{error || 'This invite link may be invalid or expired.'}</p>
          <Link to="/" className="inline-flex items-center gap-2 bg-[#0b4e9d] text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(trip.eventDate);
  const isPast = eventDate < new Date();
  const myParticipant = trip.participants.find(p => p.userId === user?.id);
  const myRsvp = myParticipant?.rsvpStatus || null;
  const myVote = trip.poll?.options.find(o => o.votes.includes(user?.id || ''))?.cafeId || null;
  const goingCount = trip.participants.filter(p => p.rsvpStatus === 'going').length;

  const getCountdown = () => {
    const diff = eventDate.getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] pb-24">
      <div className="max-w-md mx-auto px-5 pt-10">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="WIMC"
            className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
          <span className="text-[11px] font-bold text-[#7A8478] uppercase tracking-wider">Where Is My Cafe?</span>
        </Link>

        {/* Invitation Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#EAEEE8] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* Top accent */}
          <div className="h-1.5 bg-[#0b4e9d]" />

          <div className="p-6">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0b4e9d] bg-[#EAF0FB] px-2 py-0.5 rounded-full">
              You're Invited
            </span>

            <h1 className="text-2xl font-bold text-[#1E2020] mt-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              {trip.title}
            </h1>

            {/* Date/time */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-1.5 text-[12px] text-[#7A8478]">
                <Calendar className="w-3.5 h-3.5 text-[#0b4e9d]" />
                {eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="flex items-center gap-1.5 text-[12px] text-[#7A8478]">
                <Clock className="w-3.5 h-3.5 text-[#0b4e9d]" />
                {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
              </div>
            </div>

            {getCountdown() && (
              <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-[#0b4e9d] bg-[#EAF0FB] px-3 py-1 rounded-full">
                <Clock className="w-3 h-3" /> {getCountdown()} left
              </div>
            )}

            {/* Cafe */}
            {trip.selectedCafeName && (
              <div className="bg-[#F8F6F1] rounded-xl p-4 border border-[#EAEEE8] mt-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0b4e9d]" />
                  <span className="text-[14px] font-bold text-[#1E2020]">{trip.selectedCafeName}</span>
                </div>
                <a href={`/cafes/${trip.selectedCafeId}`}
                  className="inline-flex items-center gap-1 text-[11px] text-[#0b4e9d] font-semibold hover:underline mt-2">
                  View cafe <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            )}

            {/* Poll */}
            {trip.poll && !trip.poll.resolved && (
              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8478] mb-2">Vote for a cafe</p>
                <div className="space-y-2">
                  {trip.poll.options.map(opt => {
                    const isVoted = myVote === opt.cafeId;
                    return (
                      <button key={opt.cafeId}
                        onClick={() => isAuthenticated && handleVote(opt.cafeId)}
                        disabled={actionLoading.startsWith('vote') || isPast || !isAuthenticated}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all disabled:opacity-60
                        ${isVoted ? 'border-[#0b4e9d] bg-[#EAF0FB]' : 'border-[#EAEEE8] bg-white hover:border-[#0b4e9d]/30'}`}>
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isVoted ? 'text-[#0b4e9d]' : 'text-[#7A8478]'}`} />
                          <span className="text-[13px] font-semibold text-[#1E2020]">{opt.cafeName}</span>
                        </div>
                        <span className="text-[10px] text-[#7A8478]">{opt.votes.length} vote{opt.votes.length !== 1 ? 's' : ''}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RSVP */}
            {!isPast && trip.status !== 'cancelled' && isAuthenticated && (
              <div className="mt-5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8478] mb-2">Your RSVP</p>
                <div className="flex gap-2">
                  {RSVP_BUTTONS.map(btn => (
                    <button key={btn.status}
                      onClick={() => handleRsvp(btn.status)}
                      disabled={actionLoading.startsWith('rsvp')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all
                      ${myRsvp === btn.status ? btn.active : btn.cls}`}>
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Login prompt */}
            {!isAuthenticated && !isPast && (
              <div className="mt-5 bg-[#EAF0FB] rounded-xl p-4 border border-[#C8D8F0] text-center">
                <p className="text-[12px] text-[#0b4e9d] font-semibold mb-2">Log in to RSVP</p>
                <button onClick={() => setShowAuthModal(true)}
                  className="inline-flex items-center gap-2 bg-[#0b4e9d] text-white font-bold text-[11px] uppercase tracking-wider px-5 py-2.5 rounded-full hover:bg-[#093d7a] transition-colors">
                  <LogIn className="w-3 h-3" /> Sign In
                </button>
              </div>
            )}

            {/* Participants */}
            <div className="mt-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8478] mb-2 flex items-center gap-1">
                <Users className="w-3 h-3" /> {goingCount} going · {trip.participants.length} invited
              </p>
              <div className="flex flex-wrap gap-2">
                {trip.participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-1.5 bg-[#F8F6F1] rounded-full px-2.5 py-1 border border-[#EAEEE8]">
                    <div className="w-5 h-5 rounded-full bg-[#EAF0FB] flex items-center justify-center relative">
                      <span className="text-[8px] font-bold text-[#0b4e9d]">{p.name.charAt(0).toUpperCase()}</span>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white ${RSVP_DOT[p.rsvpStatus]}`} />
                    </div>
                    <span className="text-[10px] text-[#1E2020] font-medium">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="mt-5 pt-4 border-t border-[#EAEEE8]">
              <button onClick={handleCopy}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#7A8478] border border-[#EAEEE8] hover:bg-gray-50 transition-colors">
                {copied ? <><Check className="w-3 h-3 text-emerald-500" /> Link Copied</> : <><Copy className="w-3 h-3" /> Share This Invite</>}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
