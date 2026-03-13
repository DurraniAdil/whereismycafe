import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { 
    User as UserIcon, Mail, Lock, ArrowRight, 
    AtSign, Loader2, AlertCircle, X, Eye, EyeOff, Check
} from 'lucide-react';
import { API_URL } from '../../lib/api';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    dismissible?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, dismissible = true }) => {
    const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { login: setAuthData } = useAuth();
    // API_URL is now imported from ../../lib/api

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);

        const endpoint = mode === 'login' ? '/auth/login' : mode === 'register' ? '/auth/register' : '/auth/forgot-password';
        const body = mode === 'login' 
            ? { email: formData.email, password: formData.password } 
            : mode === 'register'
            ? { name: formData.name, email: formData.email, password: formData.password }
            : { email: formData.email };

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

            if (mode === 'forgot') {
                setSuccessMessage(data.message || 'Reset link sent! Please check your email.');
            } else {
                setAuthData(data.user, data.token);
                onClose();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={dismissible ? onClose : undefined}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal Container */}
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] p-5">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-[#EAEEE8] pointer-events-auto relative overflow-hidden"
                        >
                            {/* Decorative background blur */}
                            <div className="absolute top-0 right-0 w-40 h-40 bg-[#0b4e9d]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            
                            {dismissible && (
                                <button 
                                    onClick={onClose}
                                    className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#F8F6F1] text-[#A8B0A0] hover:text-[#1E2020] transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}

                            <div className="text-center mb-8 relative">
                                <div className="w-14 h-14 bg-[#0b4e9d]/5 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#0b4e9d]">
                                    <UserIcon size={28} />
                                </div>
                                <h1 className="text-2xl font-black italic text-[#1E2020] tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join the Club' : 'Reset Password'}
                                </h1>
                                <p className="text-[13px] text-[#7A8478] font-medium italic">
                                    {mode === 'login' ? 'Continue your café hopping journey.' : mode === 'register' ? 'Start discovering and saving your favorite spots.' : 'Enter your email to receive a reset link.'}
                                </p>
                            </div>

                            {successMessage ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-6"
                                >
                                    <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-green-500">
                                        <Check className="w-8 h-8" strokeWidth={3} />
                                    </div>
                                    <p className="text-sm font-bold text-[#1E2020] mb-6">{successMessage}</p>
                                    <button
                                        onClick={() => setMode('login')}
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0b4e9d] hover:underline"
                                    >
                                        Back to Login
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {mode === 'register' && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-1.5 overflow-hidden"
                                        >
                                            <label className="text-[9px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">Full Name</label>
                                            <div className="relative">
                                                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B0A0]" size={16} />
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    required={mode === 'register'}
                                                    placeholder="Adil Durrani"
                                                    className="w-full bg-[#F8F6F1] border border-[#EAEEE8] rounded-2xl pl-11 pr-5 py-3.5 focus:outline-none focus:border-[#0b4e9d] transition-colors font-bold text-[#1E2020] placeholder:text-[#D8DDD0] text-sm"
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A8B0A0]" size={16} />
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            placeholder="adil@example.com"
                                            className="w-full bg-[#F8F6F1] border border-[#EAEEE8] rounded-2xl pl-11 pr-5 py-3.5 focus:outline-none focus:border-[#0b4e9d] transition-colors font-bold text-[#1E2020] placeholder:text-[#D8DDD0] text-sm"
                                        />
                                    </div>
                                </div>

                                {mode !== 'forgot' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between ml-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A8B0A0]">Password</label>
                                            {mode === 'login' && (
                                                <button
                                                    type="button"
                                                    onClick={() => setMode('forgot')}
                                                    className="text-[9px] font-black uppercase tracking-widest text-[#0b4e9d] hover:underline"
                                                >
                                                    Forgot?
                                                </button>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[#A8B0A0]">
                                                <Lock size={16} />
                                            </div>
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-[#FBFBFB] border border-[#EAEEE8] rounded-2xl py-4 pl-14 pr-14 text-sm font-medium focus:ring-4 focus:ring-[#0b4e9d]/5 focus:border-[#0b4e9d]/20 transition-all outline-none"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-[#A8B0A0] hover:text-[#0b4e9d] transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-2 p-3.5 bg-red-50 rounded-2xl text-red-500 text-[10px] font-bold border border-red-100"
                                    >
                                        <AlertCircle size={14} />
                                        {error}
                                    </motion.div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#0b4e9d] text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-[#0b4e9d]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-2"
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin" size={16} />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Create Account' : 'Send Reset Link'}
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            )}

                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => {
                                        if (mode === 'forgot') setMode('login');
                                        else setMode(mode === 'login' ? 'register' : 'login');
                                        setError(null);
                                        setSuccessMessage(null);
                                    }}
                                    className="text-[#7A8478] hover:text-[#0b4e9d] text-[10px] font-black uppercase tracking-widest transition-colors"
                                >
                                    {mode === 'login' ? "Don't have an account? Sign Up" : mode === 'register' ? "Already have an account? Sign In" : "Back to Login"}
                                </button>
                                
                                {dismissible && mode !== 'forgot' && (
                                    <button
                                        onClick={onClose}
                                        className="block w-full mt-4 text-[#A8B0A0] hover:text-[#7A8478] text-[9px] font-bold uppercase tracking-[0.2em] transition-colors pt-4 border-t border-[#EAEEE8]"
                                    >
                                        Skip for now · Browse freely
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
