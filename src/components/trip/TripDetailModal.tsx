import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Calendar, Clock, Copy, Check, ExternalLink, Users } from 'lucide-react';
import { rsvpTrip, voteOnPoll, deleteTrip, updateTrip } from '../../lib/tripApi';
import type { Trip } from '../../types/trip';

interface Props {
  trip: Trip | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  currentUserId?: string;
}

const RSVP_BUTTONS = [
  { status: 'going' as const, label: 'Going', emoji: '✓', cls: 'bg-emerald-50 border-emerald-200 text-emerald-700', active: 'bg-emerald-500 border-emerald-500 text-white' },
  { status: 'maybe' as const, label: 'Maybe', emoji: '?', cls: 'bg-amber-50 border-amber-200 text-amber-700', active: 'bg-amber-500 border-amber-500 text-white' },
  { status: 'declined' as const, label: "Can't", emoji: '✗', cls: 'bg-red-50 border-red-200 text-red-600', active: 'bg-red-500 border-red-500 text-white' },
];

const RSVP_DOT: Record<string, string> = {
  going: 'bg-emerald-500',
  maybe: 'bg-amber-400',
  declined: 'bg-red-400',
  pending: 'bg-gray-300',
};

export const TripDetailModal: React.FC<Props> = ({ trip, isOpen, onClose, onUpdate, onDelete, currentUserId }) => {
  const [loading, setLoading] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const eventDate = new Date(trip.eventDate);
  const isPast = eventDate < new Date();
  const isCreator = currentUserId === trip.creatorId;
  const myParticipant = trip.participants.find(p => p.userId === currentUserId);
  const myRsvp = myParticipant?.rsvpStatus || null;
  const myVote = trip.poll?.options.find(o => o.votes.includes(currentUserId || ''))?.cafeId || null;

  const handleRsvp = async (status: 'going' | 'maybe' | 'declined') => {
    setLoading(`rsvp-${status}`);
    try {
      const updated = await rsvpTrip(trip._id, status);
      onUpdate(updated);
    } catch (err) {
      console.error(err);
    }
    setLoading('');
  };

  const handleVote = async (cafeId: string) => {
    setLoading(`vote-${cafeId}`);
    try {
      const updated = await voteOnPoll(trip._id, cafeId);
      onUpdate(updated);
    } catch (err) {
      console.error(err);
    }
    setLoading('');
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this trip?')) return;
    setLoading('cancel');
    try {
      const updated = await updateTrip(trip._id, { status: 'cancelled' });
      onUpdate(updated);
    } catch (err) {
      console.error(err);
    }
    setLoading('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Permanently delete this trip?')) return;
    setLoading('delete');
    try {
      await deleteTrip(trip._id);
      onDelete(trip._id);
      onClose();
    } catch (err) {
      console.error(err);
    }
    setLoading('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/trip/invite/${trip.shareableCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCountdown = () => {
    const diff = eventDate.getTime() - Date.now();
    if (diff <= 0) return null;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    if (days > 0) return `${days}d ${hours}h left`;
    const mins = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${mins}m left`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-hidden shadow-xl"
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-3 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#1E2020] leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {trip.title}
              </h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-[11px] text-[#7A8478]">
                  <Calendar className="w-3 h-3 text-[#0b4e9d]" />
                  {eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#7A8478]">
                  <Clock className="w-3 h-3 text-[#0b4e9d]" />
                  {eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                </div>
              </div>
              {getCountdown() && (
                <span className="inline-block mt-2 text-[10px] font-bold text-[#0b4e9d] bg-[#EAF0FB] px-2 py-0.5 rounded-full">
                  {getCountdown()}
                </span>
              )}
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1E2020] transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 160px)' }}>
            {/* Cafe Info or Poll */}
            {trip.selectedCafeName ? (
              <div className="bg-[#F8F6F1] rounded-xl p-4 border border-[#EAEEE8] mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0b4e9d]" />
                  <span className="text-[13px] font-bold text-[#1E2020]">{trip.selectedCafeName}</span>
                </div>
                <a href={`/cafes/${trip.selectedCafeId}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-[#0b4e9d] font-semibold hover:underline mt-1">
                  View cafe details <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            ) : trip.poll && !trip.poll.resolved ? (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8478] mb-2">
                  Vote for a cafe
                </p>
                <div className="space-y-2">
                  {trip.poll.options.map(opt => {
                    const isVoted = myVote === opt.cafeId;
                    return (
                      <button key={opt.cafeId}
                        onClick={() => !isPast && handleVote(opt.cafeId)}
                        disabled={loading.startsWith('vote') || isPast}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all disabled:opacity-60
                        ${isVoted ? 'border-[#0b4e9d] bg-[#EAF0FB] ring-1 ring-[#0b4e9d]/20' : 'border-[#EAEEE8] bg-white hover:border-[#0b4e9d]/30'}`}>
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isVoted ? 'text-[#0b4e9d]' : 'text-[#7A8478]'}`} />
                          <span className={`text-[13px] font-semibold ${isVoted ? 'text-[#0b4e9d]' : 'text-[#1E2020]'}`}>
                            {opt.cafeName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#7A8478] font-medium">
                            {opt.votes.length} vote{opt.votes.length !== 1 ? 's' : ''}
                          </span>
                          {isVoted && (
                            <div className="w-5 h-5 rounded-full bg-[#0b4e9d] flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* RSVP */}
            {!isPast && trip.status !== 'cancelled' && currentUserId && (
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8478] mb-2">Your RSVP</p>
                <div className="flex gap-2">
                  {RSVP_BUTTONS.map(btn => (
                    <button key={btn.status}
                      onClick={() => handleRsvp(btn.status)}
                      disabled={loading.startsWith('rsvp')}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all disabled:opacity-60
                      ${myRsvp === btn.status ? btn.active : btn.cls}`}>
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Participants */}
            <div className="mb-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8478] mb-2 flex items-center gap-1">
                <Users className="w-3 h-3" /> {trip.participants.length} People
              </p>
              <div className="space-y-1.5">
                {trip.participants.map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5 py-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#EAF0FB] flex items-center justify-center relative">
                      <span className="text-[10px] font-bold text-[#0b4e9d]">
                        {p.name.charAt(0).toUpperCase()}
                      </span>
                      <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${RSVP_DOT[p.rsvpStatus]}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[12px] font-semibold text-[#1E2020] truncate block">
                        {p.name}{p.userId === trip.creatorId ? ' (Host)' : ''}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold capitalize
                      ${p.rsvpStatus === 'going' ? 'text-emerald-600' : p.rsvpStatus === 'maybe' ? 'text-amber-600' : p.rsvpStatus === 'declined' ? 'text-red-500' : 'text-gray-400'}`}>
                      {p.rsvpStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Share link */}
            <div className="bg-[#F8F6F1] rounded-xl p-3 border border-[#EAEEE8] mb-4">
              <p className="text-[10px] text-[#7A8478] uppercase tracking-wider mb-1.5 font-semibold">Invite link</p>
              <div className="flex items-center gap-2">
                <input readOnly value={`${window.location.origin}/trip/invite/${trip.shareableCode}`}
                  className="flex-1 text-[10px] text-[#1E2020] bg-white border border-[#EAEEE8] rounded-lg px-2 py-1.5 truncate" />
                <button onClick={handleCopyLink}
                  className="px-2.5 py-1.5 bg-[#0b4e9d] text-white rounded-lg text-[10px] font-bold flex items-center gap-1 hover:bg-[#093d7a] transition-colors">
                  {copied ? <><Check className="w-2.5 h-2.5" /> Copied</> : <><Copy className="w-2.5 h-2.5" /> Copy</>}
                </button>
              </div>
            </div>

            {/* Creator actions */}
            {isCreator && !isPast && trip.status !== 'cancelled' && (
              <div className="flex gap-2">
                <button onClick={handleCancel} disabled={loading === 'cancel'}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors disabled:opacity-50">
                  Cancel Trip
                </button>
                <button onClick={handleDelete} disabled={loading === 'delete'}
                  className="py-2 px-4 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50">
                  Delete
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
