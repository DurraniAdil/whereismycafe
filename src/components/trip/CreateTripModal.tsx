import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Calendar, MapPin, Check, ChevronRight, Copy, Users } from 'lucide-react';
import { createTrip, fetchCafesForPicker } from '../../lib/tripApi';
import type { Trip } from '../../types/trip';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (trip: Trip) => void;
}

type CafeOption = { id: string; name: string; area: string; photos: string[] };

export const CreateTripModal: React.FC<Props> = ({ isOpen, onClose, onCreated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');

  // Step 2
  const [mode, setMode] = useState<'single' | 'poll'>('single');
  const [cafes, setCafes] = useState<CafeOption[]>([]);
  const [cafeSearch, setCafeSearch] = useState('');
  const [selectedCafe, setSelectedCafe] = useState<CafeOption | null>(null);
  const [pollCafes, setPollCafes] = useState<CafeOption[]>([]);

  // Step 3 — result
  const [createdTrip, setCreatedTrip] = useState<Trip | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCafesForPicker().then(setCafes).catch(console.error);
      // Reset
      setStep(1);
      setTitle('');
      setEventDate('');
      setEventTime('');
      setMode('single');
      setSelectedCafe(null);
      setPollCafes([]);
      setCreatedTrip(null);
      setError('');
    }
  }, [isOpen]);

  const filteredCafes = cafes.filter(c =>
    c.name.toLowerCase().includes(cafeSearch.toLowerCase()) ||
    c.area.toLowerCase().includes(cafeSearch.toLowerCase())
  );

  const handleNext = () => {
    if (step === 1) {
      if (!title.trim() || !eventDate || !eventTime) {
        return setError('Please fill in all fields');
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (mode === 'single' && !selectedCafe) {
        return setError('Please select a cafe');
      }
      if (mode === 'poll' && pollCafes.length < 2) {
        return setError('Select at least 2 cafes for a poll');
      }
      setError('');
      handleCreate();
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      const dateTime = `${eventDate}T${eventTime}`;
      const data: any = { title: title.trim(), eventDate: dateTime };

      if (mode === 'single' && selectedCafe) {
        data.cafeId = selectedCafe.id;
        data.cafeName = selectedCafe.name;
      } else if (mode === 'poll') {
        data.pollCafeOptions = pollCafes.map(c => ({ cafeId: c.id, cafeName: c.name }));
      }

      const trip = await createTrip(data);
      setCreatedTrip(trip);
      setStep(3);
      onCreated(trip);
    } catch (err: any) {
      setError(err.message || 'Failed to create trip');
    }
    setLoading(false);
  };

  const togglePollCafe = (cafe: CafeOption) => {
    setPollCafes(prev => {
      const exists = prev.find(c => c.id === cafe.id);
      if (exists) return prev.filter(c => c.id !== cafe.id);
      if (prev.length >= 3) return prev;
      return [...prev, cafe];
    });
  };

  const handleCopyLink = () => {
    if (!createdTrip) return;
    const link = `${window.location.origin}/trip/invite/${createdTrip.shareableCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass = "w-full px-4 py-3 bg-[#F8F6F1] text-[#1E2020] border border-[#EAEEE8] rounded-xl focus:outline-none focus:border-[#0b4e9d] focus:ring-1 focus:ring-[#0b4e9d]/30 transition-all placeholder:text-gray-400 text-sm";
  const labelClass = "block text-[#1E2020] text-xs font-semibold mb-2 tracking-wide uppercase";

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-md max-h-[85vh] overflow-hidden shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAEEE8]">
            <div>
              <h2 className="text-lg font-bold text-[#1E2020]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {step === 3 ? 'Trip Created!' : 'Plan a Trip'}
              </h2>
              {step < 3 && (
                <p className="text-[10px] text-[#7A8478] uppercase tracking-wider mt-0.5">
                  Step {step} of 2
                </p>
              )}
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-[#1E2020] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 140px)' }}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                className="mb-4 text-red-600 text-sm text-center bg-red-50 border border-red-200 py-2 rounded-xl">
                {error}
              </motion.div>
            )}

            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div>
                  <label className={labelClass}>Trip Name</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="Sunday Brunch Catchup" className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Date</label>
                    <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Time</label>
                    <input type="time" value={eventTime} onChange={e => setEventTime(e.target.value)}
                      className={inputClass} />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Pick Cafe */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* Mode toggle */}
                <div className="flex gap-2">
                  <button onClick={() => { setMode('single'); setPollCafes([]); }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border
                    ${mode === 'single' ? 'bg-[#0b4e9d] text-white border-[#0b4e9d]' : 'bg-white text-[#7A8478] border-[#EAEEE8]'}`}>
                    <MapPin className="w-3 h-3 inline mr-1" />Pick One
                  </button>
                  <button onClick={() => { setMode('poll'); setSelectedCafe(null); }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all border
                    ${mode === 'poll' ? 'bg-[#0b4e9d] text-white border-[#0b4e9d]' : 'bg-white text-[#7A8478] border-[#EAEEE8]'}`}>
                    <Users className="w-3 h-3 inline mr-1" />Let Friends Vote
                  </button>
                </div>

                <p className="text-[11px] text-[#7A8478]">
                  {mode === 'single' ? 'Choose a cafe for your trip.' : 'Pick 2-3 cafes. Your friends will vote!'}
                </p>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input type="text" value={cafeSearch} onChange={e => setCafeSearch(e.target.value)}
                    placeholder="Search cafes..." className={`${inputClass} pl-9`} />
                </div>

                {/* Cafe list */}
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {filteredCafes.map(cafe => {
                    const isSelected = mode === 'single'
                      ? selectedCafe?.id === cafe.id
                      : pollCafes.some(c => c.id === cafe.id);

                    return (
                      <button key={cafe.id}
                        onClick={() => mode === 'single' ? setSelectedCafe(cafe) : togglePollCafe(cafe)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all
                        ${isSelected
                            ? 'border-[#0b4e9d] bg-[#EAF0FB] ring-1 ring-[#0b4e9d]/20'
                            : 'border-[#EAEEE8] bg-white hover:border-[#0b4e9d]/30'}`}>
                        {cafe.photos[0] ? (
                          <img src={cafe.photos[0]} alt={cafe.name}
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#EAF0FB] flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-4 h-4 text-[#0b4e9d]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-[#1E2020] truncate">{cafe.name}</p>
                          <p className="text-[10px] text-[#7A8478]">{cafe.area}</p>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#0b4e9d] flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {mode === 'poll' && pollCafes.length > 0 && (
                  <p className="text-[11px] text-[#0b4e9d] font-semibold">
                    {pollCafes.length}/3 cafes selected
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && createdTrip && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-5">
                <div className="w-16 h-16 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#1E2020]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {createdTrip.title}
                  </h3>
                  <p className="text-[12px] text-[#7A8478] mt-1">
                    {new Date(createdTrip.eventDate).toLocaleDateString('en-US', {
                      weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="bg-[#F8F6F1] rounded-xl p-4 border border-[#EAEEE8]">
                  <p className="text-[10px] text-[#7A8478] uppercase tracking-wider mb-2 font-semibold">Share with friends</p>
                  <div className="flex items-center gap-2">
                    <input readOnly value={`${window.location.origin}/trip/invite/${createdTrip.shareableCode}`}
                      className="flex-1 text-[11px] text-[#1E2020] bg-white border border-[#EAEEE8] rounded-lg px-3 py-2 truncate" />
                    <button onClick={handleCopyLink}
                      className="px-3 py-2 bg-[#0b4e9d] text-white rounded-lg text-[11px] font-bold hover:bg-[#093d7a] transition-colors flex items-center gap-1">
                      {copied ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          {step < 3 && (
            <div className="px-6 py-4 border-t border-[#EAEEE8] flex gap-3">
              {step > 1 && (
                <button onClick={() => setStep(step - 1)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#7A8478] border border-[#EAEEE8] hover:bg-gray-50 transition-colors">
                  Back
                </button>
              )}
              <button onClick={handleNext} disabled={loading}
                className="flex-1 py-2.5 bg-[#0b4e9d] text-white rounded-xl text-sm font-bold hover:bg-[#093d7a] disabled:opacity-50 transition-all flex items-center justify-center gap-1.5">
                {loading ? 'Creating...' : step === 2 ? 'Create Trip' : <>Next <ChevronRight className="w-3.5 h-3.5" /></>}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="px-6 py-4 border-t border-[#EAEEE8]">
              <button onClick={onClose}
                className="w-full py-2.5 bg-[#1E2020] text-white rounded-xl text-sm font-bold hover:bg-[#2E3030] transition-colors">
                Done
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
