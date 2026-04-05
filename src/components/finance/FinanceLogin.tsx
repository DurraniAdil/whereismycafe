import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { financeLogin, financeRegister } from '../../lib/financeApi';
import type { FinanceOwner } from '../../types/finance';

interface Props {
  onLogin: (owner: FinanceOwner) => void;
}

export const FinanceLogin: React.FC<Props> = ({ onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register extra fields
  const [name, setName] = useState('');
  const [cafeName, setCafeName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passcode, setPasscode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegister) {
      if (password !== confirmPassword) {
        return setError('Passwords do not match');
      }
    }

    setLoading(true);
    try {
      if (isRegister) {
        const { token, owner } = await financeRegister({
          name, cafeName, email, password, passcode
        });
        localStorage.setItem('wimc_owner_token', token);
        onLogin(owner);
      } else {
        const { token, owner } = await financeLogin(email, password);
        localStorage.setItem('wimc_owner_token', token);
        onLogin(owner);
      }
    } catch (err: any) {
      setError(err.message || (isRegister ? 'Registration failed' : 'Login failed'));
    }
    setLoading(false);
  };

  const inputClass = "w-full px-4 py-3 bg-[#F8F6F1] text-[#1E2020] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0b4e9d] focus:ring-1 focus:ring-[#0b4e9d]/30 transition-all placeholder:text-gray-400 text-sm";
  const labelClass = "block text-[#1E2020] text-xs font-semibold mb-2 tracking-wide uppercase";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F6F1] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo + Title */}
        <div className="text-center mb-8">
          <motion.div
            className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-transparent flex items-center justify-center"
            animate={{ rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src="/media/map-pin.png" alt="WIMC Portal" className="w-14 h-14 object-contain drop-shadow-sm" />
          </motion.div>
          <h1 className="text-2xl font-bold text-[#1E2020] tracking-tight">WIMC Portal</h1>
          <p className="text-[#8a8a8a] text-sm mt-1.5">{isRegister ? "Create your cafe owner account" : "Manage your café's finances"}</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 text-red-600 text-sm text-center bg-red-50 border border-red-200 py-2.5 rounded-xl"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="popLayout">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className={labelClass}>Your Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputClass} required={isRegister} />
                  </div>
                  <div>
                    <label className={labelClass}>Cafe Name</label>
                    <input type="text" value={cafeName} onChange={(e) => setCafeName(e.target.value)} placeholder="The Daily Grind" className={inputClass} required={isRegister} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-4">
              <label className={labelClass}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="owner@cafe.com" className={inputClass} required />
            </div>

            <div className="mb-4">
              <label className={labelClass}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClass} required />
            </div>

            <AnimatePresence mode="popLayout">
              {isRegister && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className={labelClass}>Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={inputClass} required={isRegister} />
                  </div>
                  <div>
                    <label className={labelClass}>Invite Passcode</label>
                    <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)} placeholder="Secret Passcode" className={inputClass} required={isRegister} />
                    <p className="text-[10px] text-gray-400 mt-1.5">Required to create a new WIMC finance account.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isRegister && <div className="mb-2" />}

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-2 bg-[#0b4e9d] text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-[#093d7a] disabled:opacity-50 transition-all text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="40 60" /></svg>
                  {isRegister ? 'Creating Account...' : 'Authenticating...'}
                </span>
              ) : (isRegister ? 'Sign Up' : 'Sign In')}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">
              {isRegister ? "Already have an account?" : "Don't have an account?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="ml-1.5 font-bold text-[#0b4e9d] hover:underline"
            >
              {isRegister ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-5">
          Cafe owner access only · WIMC Finance
        </p>
      </motion.div>
    </div>
  );
};
