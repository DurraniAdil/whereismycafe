import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    User as UserIcon, Mail, Lock, ArrowRight, 
    AtSign, ChevronLeft, Loader2, AlertCircle
} from 'lucide-react';
import { API_URL } from '../lib/api';

export const Auth: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { login: setAuthData } = useAuth();
    const navigate = useNavigate();

    // API_URL is now imported from ../lib/api

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';
        const body = mode === 'login' 
            ? { email, password } 
            : { name, email, password };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setAuthData(data.user, data.token);
            navigate('/profile');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F6F1] flex flex-col items-center justify-center p-5 font-sans relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-[#0b4e9d]/5 rounded-full blur-[8rem] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-[#0b4e9d]/5 rounded-full blur-[8rem] translate-y-1/2 -translate-x-1/2" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <Link to="/" className="inline-flex items-center gap-2 text-[#A8B0A0] hover:text-[#0b4e9d] transition-colors mb-8 group">
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Home</span>
                </Link>

                <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_48px_rgba(0,0,0,0.04)] border border-[#EAEEE8]">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-[#0b4e9d]/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-[#0b4e9d]">
                            <UserIcon size={32} />
                        </div>
                        <h1 className="text-3xl font-black italic text-[#1E2020] tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {mode === 'login' ? 'Welcome Back' : 'Join the Club'}
                        </h1>
                        <p className="text-sm text-[#7A8478] font-medium italic">
                            {mode === 'login' ? 'Continue your café hopping journey.' : 'Start discovering and saving your favorite spots.'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {mode === 'register' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-2 overflow-hidden"
                                >
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">Full Name</label>
                                    <div className="relative">
                                        <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B0A0]" size={18} />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required={mode === 'register'}
                                            placeholder="Adil Durrani"
                                            className="w-full bg-[#F8F6F1] border border-[#EAEEE8] rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-[#0b4e9d] transition-colors font-bold text-[#1E2020] placeholder:text-[#D8DDD0]"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B0A0]" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="adil@example.com"
                                    className="w-full bg-[#F8F6F1] border border-[#EAEEE8] rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-[#0b4e9d] transition-colors font-bold text-[#1E2020] placeholder:text-[#D8DDD0]"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B0A0]" size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full bg-[#F8F6F1] border border-[#EAEEE8] rounded-2xl pl-12 pr-5 py-4 focus:outline-none focus:border-[#0b4e9d] transition-colors font-bold text-[#1E2020] placeholder:text-[#D8DDD0]"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 p-4 bg-red-50 rounded-2xl text-red-500 text-xs font-bold border border-red-100"
                            >
                                <AlertCircle size={16} />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#0b4e9d] text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-[#0b4e9d]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                            className="text-[#7A8478] hover:text-[#0b4e9d] text-[11px] font-black uppercase tracking-widest transition-colors"
                        >
                            {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
