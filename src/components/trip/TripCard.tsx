import React from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Users, Copy, Check, Clock } from 'lucide-react';
import type { Trip } from '../../types/trip';

interface Props {
  trip: Trip;
  onClick: (trip: Trip) => void;
  currentUserId?: string;
}

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  planning: { label: 'Poll Active', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  confirmed: { label: 'Confirmed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  completed: { label: 'Completed', cls: 'bg-gray-100 text-gray-500 border-gray-200' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-50 text-red-600 border-red-200' },
};

const RSVP_DOTS: Record<string, string> = {
  going: 'bg-emerald-500',
  maybe: 'bg-amber-400',
  declined: 'bg-red-400',
  pending: 'bg-gray-300',
};

export const TripCard: React.FC<Props> = ({ trip, onClick, currentUserId }) => {
  const [copied, setCopied] = React.useState(false);
  const badge = STATUS_BADGES[trip.status] || STATUS_BADGES.planning;
  const eventDate = new Date(trip.eventDate);
  const isPast = eventDate < new Date();
  const goingCount = trip.participants.filter(p => p.rsvpStatus === 'going').length;
  const myParticipant = trip.participants.find(p => p.userId?.toString() === currentUserId?.toString());

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/trip/invite/${trip.shareableCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d: Date) => {
    const day = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${day} · ${time}`;
  };

  const getCountdown = () => {
    const diff = eventDate.getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m`;
  };

  const countdown = getCountdown();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.985 }}
      onClick={() => onClick(trip)}
      className={`bg-white rounded-2xl border border-[#EAEEE8] shadow-[0_2px_12px_rgba(0,0,0,0.04)]
        p-5 cursor-pointer hover:shadow-[0_4px_20px_rgba(11,78,157,0.08)] transition-all
        ${isPast ? 'opacity-70' : ''}`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-bold text-[#1E2020] truncate leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            {trip.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <Calendar className="w-3 h-3 text-[#0b4e9d] flex-shrink-0" />
            <span className="text-[11px] text-[#7A8478]">{formatDate(eventDate)}</span>
          </div>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border flex-shrink-0 ${badge.cls}`}>
          {badge.label}
        </span>
      </div>

      {/* Cafe info */}
      <div className="flex items-center gap-1.5 mb-3">
        <MapPin className="w-3 h-3 text-[#0b4e9d] flex-shrink-0" />
        <span className="text-[12px] text-[#1E2020] font-medium truncate">
          {trip.selectedCafeName || (trip.poll ? `${trip.poll.options.length} cafes in poll` : 'TBD')}
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        {/* Participant avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {trip.participants.slice(0, 5).map((p, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-[#EAF0FB] border-2 border-white
                flex items-center justify-center relative" title={`${p.name} (${p.rsvpStatus})`}>
                <span className="text-[8px] font-bold text-[#0b4e9d]">
                  {p.name.charAt(0).toUpperCase()}
                </span>
                <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${RSVP_DOTS[p.rsvpStatus]}`} />
              </div>
            ))}
            {trip.participants.length > 5 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                <span className="text-[8px] font-bold text-gray-500">+{trip.participants.length - 5}</span>
              </div>
            )}
          </div>
          <span className="text-[10px] text-[#7A8478]">
            {goingCount} going
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Post-trip feedback status */}
          {isPast && currentUserId && (
            <div className="flex items-center gap-1.5 mr-1">
              {trip.participants.find(p => p.userId?.toString() === currentUserId?.toString())?.feedback === 'success' ? (
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <Check className="w-2.5 h-2.5" /> Success
                </div>
              ) : trip.participants.find(p => p.userId?.toString() === currentUserId?.toString())?.feedback === 'next_time' ? (
                <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                  Next Time
                </div>
              ) : myParticipant?.rsvpStatus === 'going' ? (
                <div className="flex items-center gap-1 text-[10px] text-[#0b4e9d] font-bold bg-[#EAF0FB] px-2 py-0.5 rounded-full border border-blue-100 animate-pulse">
                  Unlogged
                </div>
              ) : null}
            </div>
          )}

          {/* Countdown */}
          {countdown && (
            <div className="flex items-center gap-1 text-[10px] text-[#0b4e9d] font-semibold bg-[#EAF0FB] px-2 py-0.5 rounded-full">
              <Clock className="w-2.5 h-2.5" />
              {countdown}
            </div>
          )}

          {/* Share */}
          <button onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-[#7A8478] hover:text-[#0b4e9d] transition-colors">
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
