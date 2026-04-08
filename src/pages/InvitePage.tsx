import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, ExternalLink, Check, Copy, Users, LogIn, X, Search, Home, Edit2, Save, Trophy, Frown, Star } from 'lucide-react';
import { fetchTripByCode, rsvpTrip, voteOnPoll, fetchCafesForPicker, updateTrip, deleteTrip, submitTripFeedback } from '../lib/tripApi';
import { useAuth } from '../context/AuthContext';
import type { Trip } from '../types/trip';

type CafeOption = { id: string; name: string; area: string; photos: string[] };

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

  // Suggesting new cafe
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [cafes, setCafes] = useState<CafeOption[]>([]);
  const [cafeSearch, setCafeSearch] = useState('');
  const [stagedSuggestion, setStagedSuggestion] = useState<CafeOption | null>(null);

  // Editing trip
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (isSuggesting && cafes.length === 0) {
      fetchCafesForPicker().then(setCafes).catch(console.error);
    }
  }, [isSuggesting, cafes.length]);

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    fetchTripByCode(code)
      .then(data => {
        setTrip(data.trip);
        setEditTitle(data.trip.title);
        const d = new Date(data.trip.eventDate);
        setEditDate(d.toISOString().split('T')[0]);
        setEditTime(d.toTimeString().slice(0, 5));
        setEditDescription(data.trip.description || '');
      })
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

  const handleVote = async (cafeId: string, newCafeName?: string) => {
    if (!trip || !isAuthenticated) return;
    setActionLoading(`vote-${cafeId}`);
    try {
      const updated = await voteOnPoll(trip._id, cafeId, newCafeName);
      setTrip(updated);
      setIsSuggesting(false);
      setStagedSuggestion(null);
    } catch (err) {
      console.error(err);
    }
    setActionLoading('');
  };

  const handleSaveEdit = async () => {
    if (!trip || !editTitle.trim() || !editDate || !editTime) return;
    setActionLoading('edit');
    try {
      const dateTime = `${editDate}T${editTime}`;
      const updated = await updateTrip(trip._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        eventDate: dateTime
      });
      setTrip(updated);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
    setActionLoading('');
  };

  const handleCancelTrip = async () => {
    if (!trip) return;
    if (!window.confirm('Cancel this trip?')) return;
    setActionLoading('cancel');
    try {
      const updated = await updateTrip(trip._id, { status: 'cancelled' });
      setTrip(updated);
    } catch (err) {
      console.error(err);
    }
    setActionLoading('');
  };

  const handleDeleteTrip = async () => {
    if (!trip) return;
    if (!window.confirm('Permanently delete this trip?')) return;
    setActionLoading('delete');
    try {
      await deleteTrip(trip._id);
      window.location.href = '/trip';
    } catch (err) {
      console.error(err);
    }
    setActionLoading('');
  };

  const handleFeedback = async (val: 'success' | 'next_time') => {
    if (!trip) return;
    setActionLoading(`feedback-${val}`);
    try {
      const updated = await submitTripFeedback(trip._id, val);
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

  const currentUserId = user?.id;
  const eventDate = new Date(trip.eventDate);
  const isPast = eventDate < new Date();
  const isCreator = currentUserId?.toString() === trip.creatorId?.toString();
  const myParticipant = trip.participants.find(p => p.userId?.toString() === currentUserId?.toString());
  const myRsvp = myParticipant?.rsvpStatus || null;
  const showFeedbackBanner = isPast && myRsvp === 'going' && trip.status !== 'cancelled';
  const myVote = trip.poll?.options.find(o => o.votes.some(v => v.toString() === currentUserId?.toString()))?.cafeId || null;
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
        <Link to="/" className="flex items-center gap-2 mb-8">
          <img src={`${import.meta.env.BASE_URL}media/circle.png`} alt="WIMC"
            className="w-8 h-8 rounded-full object-cover border border-white shadow-sm" />
          <span className="text-[11px] font-bold text-[#7A8478] uppercase tracking-wider">Where Is My Cafe?</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#EAEEE8] shadow-[0_4px_24px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="h-1.5 bg-[#0b4e9d]" />

          <div className="p-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0b4e9d]">Editing Trip</span>
                </div>
                <input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  className="w-full text-2xl font-bold text-[#1E2020] border-b border-[#0b4e9d] focus:outline-none bg-transparent mb-2" />
                <div className="flex gap-2">
                  <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)}
                    className="flex-1 text-[12px] text-[#7A8478] bg-[#F8F6F1] rounded-xl px-3 py-2.5 focus:outline-none border border-[#EAEEE8]" />
                  <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)}
                    className="flex-1 text-[12px] text-[#7A8478] bg-[#F8F6F1] rounded-xl px-3 py-2.5 focus:outline-none border border-[#EAEEE8]" />
                </div>
                <textarea value={editDescription} onChange={e => setEditDescription(e.target.value)}
                  placeholder="Invite description..."
                  className="w-full bg-[#F8F6F1] text-[13px] text-[#1E2020] border border-[#EAEEE8] rounded-xl px-3 py-3 focus:outline-none focus:border-[#0b4e9d]" />
              </div>
            ) : (
              <>
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0b4e9d] bg-[#EAF0FB] px-2 py-0.5 rounded-full">
                  You're Invited
                </span>

                <div className="flex items-center justify-between mt-4">
                  <h1 className="text-2xl font-bold text-[#1E2020] leading-tight"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {trip.title}
                  </h1>
                </div>

                {trip.description && (
                  <p className="text-[13px] text-[#7A8478] mt-2 leading-relaxed">
                    {trip.description}
                  </p>
                )}

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
              </>
            )}

            {showFeedbackBanner && (
              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-[#0b4e9d] to-[#083d7a] text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                  {!myParticipant?.feedback ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <Trophy className="w-5 h-5 text-yellow-300" />
                        <h4 className="font-bold text-sm uppercase tracking-tight">Was it a success?</h4>
                      </div>
                      <p className="text-[11px] text-blue-100 mb-4 leading-relaxed">
                        The time for your trip to <b>{trip.selectedCafeName || 'the cafe'}</b> has passed! Did you make it?
                      </p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleFeedback('success')}
                          disabled={actionLoading.startsWith('feedback')}
                          className="flex-1 bg-white text-[#0b4e9d] py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-blue-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 fill-current" /> Success!
                        </button>
                        <button 
                          onClick={() => handleFeedback('next_time')}
                          disabled={actionLoading.startsWith('feedback')}
                          className="flex-1 bg-white/10 text-white border border-white/20 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-white/20 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Frown className="w-3.5 h-3.5" /> Next Time
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-4 py-2">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        {myParticipant.feedback === 'success' ? (
                          <Trophy className="w-6 h-6 text-yellow-300" />
                        ) : (
                          <Frown className="w-6 h-6 text-white/70" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">
                          {myParticipant.feedback === 'success' ? 'Memory Logged!' : 'Always Next Time'}
                        </h4>
                        <p className="text-[11px] text-blue-100">
                          {myParticipant.feedback === 'success' 
                            ? 'This cafe has been added to your visited list. ✨' 
                            : 'No worries, keep exploring! ☕'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/5 rounded-full blur-xl" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl" />
              </div>
            )}
          </div>

          <div className="p-6 pt-0">
            {/* Cafe */}
            {trip.selectedCafeName && (
              <div className="bg-[#F8F6F1] rounded-xl p-4 border border-[#EAEEE8] mt-5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#0b4e9d]" />
                  <span className="text-[14px] font-bold text-[#1E2020]">{trip.selectedCafeName}</span>
                </div>
                <a href={`/cafes/${trip.selectedCafeId}`} target="_blank" rel="noopener noreferrer"
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
                        onClick={() => !isPast && handleVote(opt.cafeId)}
                        disabled={actionLoading.startsWith('vote') || isPast}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all disabled:opacity-60
                        ${isVoted ? 'border-[#0b4e9d] bg-[#EAF0FB]' : 'border-[#EAEEE8] bg-white'}`}>
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-3.5 h-3.5 ${isVoted ? 'text-[#0b4e9d]' : 'text-[#7A8478]'}`} />
                          <span className="text-[13px] font-semibold text-[#1E2020]">{opt.cafeName}</span>
                        </div>
                        <span className="text-[10px] text-[#7A8478]">{opt.votes.length} vote{opt.votes.length !== 1 ? 's' : ''}</span>
                      </button>
                    );
                  })}
                </div>

                {!isPast && isAuthenticated && !isSuggesting && (
                  <button type="button" onClick={() => setIsSuggesting(true)}
                    className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-[#B8C0C8] text-[11px] font-bold text-[#7A8478] hover:bg-gray-50 transition-colors uppercase tracking-wider">
                    + Suggest another cafe
                  </button>
                )}

                {isSuggesting && (
                  <div className="mt-3 p-3 bg-[#F8F6F1] rounded-xl border border-[#EAEEE8]">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] uppercase font-bold text-[#1E2020]">
                        {stagedSuggestion ? 'Ready to Suggest?' : 'Find a Cafe'}
                      </p>
                      <button type="button" onClick={() => { setIsSuggesting(false); setStagedSuggestion(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                    </div>

                    {!stagedSuggestion ? (
                      <>
                        <div className="relative mb-2">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input type="text" value={cafeSearch} onChange={e => setCafeSearch(e.target.value)}
                            placeholder="Search..." className="w-full pl-8 pr-3 py-2 bg-white text-xs border border-[#EAEEE8] rounded-lg focus:outline-none focus:border-[#0b4e9d]" />
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {cafes
                            .filter(c => !trip.poll!.options.some(opt => opt.cafeId === c.id) && c.name.toLowerCase().includes(cafeSearch.toLowerCase()))
                            .map(cafe => (
                            <button type="button" key={cafe.id} onClick={() => setStagedSuggestion(cafe)}
                              className="w-full flex items-center justify-between p-2 hover:bg-[#EAF0FB] rounded-lg text-left transition-colors">
                              <span className="text-[12px] font-medium text-[#1E2020] truncate">{cafe.name}</span>
                              <span className="text-[9px] text-[#0b4e9d] font-bold">SELECT</span>
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="bg-white p-3 rounded-xl border border-[#EAEEE8] flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#0b4e9d]" />
                          <span className="text-sm font-bold text-[#1E2020]">{stagedSuggestion.name}</span>
                        </div>
                        <button type="button" 
                          onClick={() => handleVote(stagedSuggestion.id, stagedSuggestion.name)}
                          disabled={actionLoading.startsWith('vote')}
                          className="w-full py-3 bg-[#0b4e9d] text-white rounded-xl text-xs font-bold hover:bg-[#093d7a] transition-all flex items-center justify-center gap-2">
                          {actionLoading.startsWith('vote') ? 'Suggesting...' : 'CONFIRM SUGGESTION'}
                        </button>
                        <button type="button" onClick={() => setStagedSuggestion(null)}
                          className="w-full py-2 text-[10px] font-bold text-[#7A8478] uppercase tracking-wider">
                          Back to Search
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* RSVP */}
            {!isPast && trip.status !== 'cancelled' && isAuthenticated && (!trip.poll || trip.poll.resolved || myVote) && (
              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#7A8478] mb-2">Your RSVP</p>
                <div className="flex gap-2">
                  {RSVP_BUTTONS.map(btn => (
                    <button key={btn.status}
                      type="button"
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

            {/* Participants */}
            <div className="mt-8">
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
                    <span className="text-[10px] text-[#1E2020] font-medium">
                      {p.name}{p.userId === trip.creatorId ? ' (Host)' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer actions */}
            <div className="mt-8 pt-6 border-t border-[#EAEEE8] space-y-3">
              <button onClick={handleCopy}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-[#7A8478] border border-[#EAEEE8] hover:bg-gray-50 transition-colors">
                {copied ? <><Check className="w-3 h-3 text-emerald-500" /> Link Copied</> : <><Copy className="w-3 h-3" /> Share This Invite</>}
              </button>
              
              <Link to="/"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-[#0b4e9d] bg-[#EAF0FB] hover:bg-[#D5E1F6] transition-colors uppercase tracking-wider">
                <Home className="w-3.5 h-3.5" /> Back Home
              </Link>
            </div>

            {/* Host actions */}
            {isCreator && !isPast && trip.status !== 'cancelled' && (
              <div className="mt-6 pt-6 border-t border-dashed border-[#EAEEE8]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0b4e9d] mb-4">Host Controls</p>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)}
                        className="flex-1 py-3 rounded-xl text-xs font-semibold text-[#7A8478] bg-gray-50 border border-[#EAEEE8]">
                        Cancel
                      </button>
                      <button onClick={handleSaveEdit} disabled={actionLoading === 'edit'}
                        className="flex-1 py-3 flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-white bg-[#0b4e9d] disabled:opacity-50">
                        <Save className="w-3.5 h-3.5" /> Save
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setIsEditing(true)}
                        className="flex-1 py-3 flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-[#0b4e9d] bg-[#EAF0FB]">
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      <button onClick={handleCancelTrip} disabled={actionLoading === 'cancel'}
                        className="flex-1 py-3 rounded-xl text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-100">
                        Stop
                      </button>
                      <button onClick={handleDeleteTrip} disabled={actionLoading === 'delete'}
                        className="px-4 py-3 rounded-xl text-xs font-semibold text-red-600 bg-red-50 border border-red-100">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
