import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCollections } from '../hooks/useCollections';
import { getAllCafes } from '../lib/getCafes';
import { API_URL } from '../lib/api';
import { Cafe } from '../types/cafe';
import { CafeCard } from '../components/CafeCard';
import {
    MapPin, Star, Coffee, LogOut, Settings, Lock,
    Bookmark, Edit3, Calendar, ChevronRight,
    User as UserIcon, Heart, X, BookmarkX,
    ChevronLeft, Camera, Check, Image as ImageIcon
} from 'lucide-react';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1, y: 0,
        transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' }
    })
};

export const Profile: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const {
        heartedIds, visitedEntries,
        toggleHeart, removeVisited, getVisitDate
    } = useCollections();
    const navigate = useNavigate();

    // UI state
    const [activeTab, setActiveTab] = useState<'saved' | 'visited' | 'reviews'>('saved');
    const [isDashboard, setIsDashboard] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState<{ id: string; name: string; type: 'saved' | 'visited' } | null>(null);

    const [allReviews, setAllReviews] = useState<any[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const [editName, setEditName] = useState(user?.name ?? 'Adil Durrani');
    const [editEmail, setEditEmail] = useState(user?.email ?? 'adil@example.com');
    // Change Password state
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwords, setPasswords] = useState({ current: '', next: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwMessage, setPwMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Cafe data state
    const [allCafes, setAllCafes] = useState<Cafe[]>([]);
    const [loadingCafes, setLoadingCafes] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        getAllCafes()
            .then(setAllCafes)
            .finally(() => setLoadingCafes(false));
    }, []);

    useEffect(() => {
        if (activeTab === 'reviews') {
            loadUserReviews();
        }
    }, [activeTab]);

    const loadUserReviews = async () => {
        try {
            setLoadingReviews(true);
            const token = localStorage.getItem('wimc_token');
            const res = await fetch(`${API_URL}/user/reviews`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAllReviews(data);
            }
        } catch (err) {
            console.error('Failed to load reviews:', err);
        } finally {
            setLoadingReviews(false);
        }
    };

    const savedCafes = allCafes.filter(c => heartedIds.includes(c.id));
    const visitedCafes = visitedEntries
        .map(entry => allCafes.find(c => c.id === entry.id))
        .filter((c): c is NonNullable<typeof c> => !!c);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                updateUser({ picture: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        updateUser({
            name: editName,
            email: editEmail
        });
        setIsDashboard(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwLoading(true);
        setPwMessage(null);
        try {
            const token = localStorage.getItem('wimc_token');
            const res = await fetch(`${API_URL}/auth/change-password`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: passwords.current,
                    newPassword: passwords.next
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to change password');

            setPwMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswords({ current: '', next: '' });
            setTimeout(() => setShowChangePassword(false), 2000);
        } catch (err: any) {
            setPwMessage({ type: 'error', text: err.message });
        } finally {
            setPwLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const stats = [
        { icon: <Coffee size={18} />, label: 'Visited', value: visitedEntries.length.toString() },
        { icon: <Star size={18} />, label: 'Reviews', value: user?.reviewCount ?? '0' },
        { icon: <Bookmark size={18} />, label: 'Saved', value: heartedIds.length.toString() },
    ];

    const handleDeleteConfirm = async () => {
        if (!confirmRemove) return;
        if (confirmRemove.type === 'saved') {
            await toggleHeart(confirmRemove.id);
        } else {
            await removeVisited(confirmRemove.id);
        }
        setConfirmRemove(null);
    };


    return (
        <div className="min-h-screen bg-[#F8F6F1] text-[#1E2020] pb-24 font-sans">

            {/* Confirmation Modal */}
            <AnimatePresence>
                {confirmRemove && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-5">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setConfirmRemove(null)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative bg-white rounded-[2.5rem] p-8 shadow-2xl max-w-sm w-full text-center border border-[#EAEEE8]"
                        >
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                                <X size={32} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl font-black italic text-[#1E2020] mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                Are you sure?
                            </h3>
                            <p className="text-sm text-[#7A8478] leading-relaxed mb-8">
                                Do you really want to remove <span className="text-[#1E2020] font-bold">{confirmRemove.name}</span> from your {confirmRemove.type} list?
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="bg-red-500 text-white text-[11px] font-black uppercase tracking-[.2em] py-4 rounded-2xl shadow-xl shadow-red-500/20 hover:bg-red-600 transition-colors"
                                >
                                    Yes, Remove it
                                </button>
                                <button
                                    onClick={() => setConfirmRemove(null)}
                                    className="bg-white border border-[#EAEEE8] text-[#7A8478] text-[11px] font-black uppercase tracking-[.2em] py-4 rounded-2xl hover:bg-[#F4F4F0] transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header Banner */}
            <div className="relative h-48 md:h-64 border-b border-[#EAEEE8] overflow-hidden group">
                {/* poster.png as cover image */}
                <img
                    src="/media/poster.png"
                    alt="Cover"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />

                {/* Desktop Back button */}
                <div className="absolute top-6 left-6 hidden md:block">
                    <Link to="/" className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white shadow-xl hover:bg-[#F4F4F0] transition group/back border border-white/40 backdrop-blur-md">
                        <ChevronLeft size={18} className="text-[#0b4e9d] group-hover/back:-translate-x-0.5 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.14em] text-[#1E2020]">Home</span>
                    </Link>
                </div>

                {/* Settings / Dashboard Toggle button */}
                <div className="absolute top-6 right-6">
                    <button
                        onClick={() => setIsDashboard(!isDashboard)}
                        className={`p-3 rounded-2xl transition-all shadow-xl backdrop-blur-md border border-white/40 ${isDashboard ? 'bg-[#0b4e9d] text-white scale-110' : 'bg-white text-[#A8B0A0] hover:bg-[#F4F4F0]'
                            }`}
                        title={isDashboard ? "View Profile" : "Edit Profile"}
                    >
                        {isDashboard ? <X size={20} /> : <Settings size={20} />}
                    </button>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-5">

                {/* Avatar + Action Row */}
                <div className="relative -mt-14 mb-8 flex items-end justify-between">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                        className="relative"
                    >
                        <div className="w-28 h-28 rounded-[2.5rem] bg-white flex items-center justify-center text-4xl font-black italic shadow-[0_8px_32px_rgba(11,78,157,0.18)] border-4 border-[#F8F6F1] tracking-tighter text-[#0b4e9d] overflow-hidden"
                            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {user?.picture ? (
                                <img src={user.picture} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <img src={`${import.meta.env.BASE_URL}media/map-pin.png`} alt="Avatar" className="w-full h-full p-6" />
                            )}
                        </div>
                    </motion.div>

                    {!isDashboard && (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white border border-[#EAEEE8]
                hover:bg-red-50 hover:border-red-100 text-[#7A8478] hover:text-red-500 text-[11px] font-black uppercase tracking-[0.14em] transition-all mb-2 shadow-sm"
                        >
                            <LogOut size={14} />
                            Log out
                        </button>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {isDashboard ? (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            className="space-y-6"
                        >
                            <div className="bg-white rounded-3xl p-6 border border-[#EAEEE8] shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
                                <h2 className="text-xl font-black text-[#1E2020] italic tracking-tight mb-6"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    Dashboard
                                </h2>

                                <div className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">Full Name</label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="w-full bg-[#F8F6F1] border border-[#EAEEE8] rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0b4e9d] transition-colors font-bold text-[#1E2020]"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={editEmail}
                                            className="w-full bg-[#FBFBFB] border border-[#EAEEE8] rounded-2xl px-5 py-4 font-bold text-[#A8B0A0] cursor-not-allowed opacity-60"
                                            title="Email cannot be changed"
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-3">
                                    <button
                                        onClick={handleSaveChanges}
                                        className="flex-1 bg-[#0b4e9d] text-white text-[11px] font-black uppercase tracking-[.2em] py-4 rounded-2xl shadow-xl hover:bg-[#0a3d7a] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={16} strokeWidth={3} />
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={() => setIsDashboard(false)}
                                        className="px-8 bg-white border border-[#EAEEE8] text-[#7A8478] text-[11px] font-black uppercase tracking-[.2em] py-4 rounded-2xl hover:bg-[#F4F4F0] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>

                            {/* Change Password Trigger */}
                            <div className="mt-8 pt-8 border-t border-[#EAEEE8]">
                                <button
                                    onClick={() => setShowChangePassword(!showChangePassword)}
                                    className="w-full bg-white border border-[#EAEEE8] text-[#1E2020] text-[11px] font-black uppercase tracking-[.2em] py-5 rounded-3xl hover:bg-[#FBFBFB] transition-all flex items-center justify-between px-8 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#0b4e9d]/5 rounded-xl flex items-center justify-center text-[#0b4e9d] group-hover:bg-[#0b4e9d] group-hover:text-white transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <span>Change Password</span>
                                    </div>
                                    <ChevronRight size={18} className={`transition-transform duration-300 ${showChangePassword ? 'rotate-90' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {showChangePassword && (
                                        <motion.form
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            onSubmit={handleChangePassword}
                                            className="overflow-hidden"
                                        >
                                            <div className="pt-6 space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">Current Password</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwords.current}
                                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                                        placeholder="••••••••"
                                                        className="w-full bg-[#FBFBFB] border border-[#EAEEE8] rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0b4e9d] transition-colors font-bold text-[#1E2020] text-sm"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[9px] font-black uppercase tracking-widest text-[#A8B0A0] ml-1">New Password</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={passwords.next}
                                                        onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
                                                        placeholder="••••••••"
                                                        className="w-full bg-[#FBFBFB] border border-[#EAEEE8] rounded-2xl px-5 py-4 focus:outline-none focus:border-[#0b4e9d] transition-colors font-bold text-[#1E2020] text-sm"
                                                    />
                                                </div>
                                                {pwMessage && (
                                                    <div className={`text-[11px] font-bold p-4 rounded-2xl border ${pwMessage.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 'bg-red-50 border-red-100 text-red-500'
                                                        }`}>
                                                        {pwMessage.text}
                                                    </div>
                                                )}
                                                <button
                                                    type="submit"
                                                    disabled={pwLoading}
                                                    className="w-full bg-[#1E2020] text-white text-[10px] font-black uppercase tracking-[.2em] py-4 rounded-2xl hover:bg-black transition-colors"
                                                >
                                                    {pwLoading ? 'Updating...' : 'Update Password'}
                                                </button>
                                            </div>
                                        </motion.form>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                        >
                            {/* Name + Meta */}
                            <div className="mb-8">
                                <h1 className="text-4xl font-black text-[#1E2020] italic tracking-tight mb-1"
                                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                    {user?.name ?? 'Adil Durrani'}
                                </h1>
                                <p className="text-[#7A8478] text-base font-medium opacity-80">{user?.email ?? 'adil@example.com'}</p>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-5 text-[#A8B0A0] text-[10px] font-black uppercase tracking-[0.16em]">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} className="text-[#0b4e9d]" />
                                        <span>Since {user?.joinedAt ? formatDate(user.joinedAt) : 'March 2026'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Row */}
                            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-10">
                                {stats.map((stat, i) => (
                                    <div key={i}
                                        className="bg-white border border-[#EAEEE8] rounded-[2rem] p-5 
                    flex flex-col items-center gap-1 hover:border-[#0b4e9d]/20 transition-all shadow-sm group/stat">
                                        <span className="text-[#0b4e9d] mb-1 group-hover/stat:scale-110 transition-transform">{stat.icon}</span>
                                        <span className="text-2xl font-black text-[#1E2020] italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stat.value}</span>
                                        <span className="text-[#A8B0A0] text-[9px] font-black uppercase tracking-[0.14em] text-center">{stat.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Tabs */}
                            <div className="flex bg-white rounded-[1.5rem] p-1.5 mb-8 border border-[#EAEEE8] shadow-sm">
                                {(['saved', 'visited', 'reviews'] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.18em] transition-all ${activeTab === tab
                                            ? 'bg-[#0b4e9d] text-white shadow-[0_8px_20px_rgba(11,78,157,0.3)]'
                                            : 'text-[#7A8478] hover:text-[#0b4e9d] hover:bg-[#F4F4F0]'
                                            }`}
                                    >
                                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                    </button>
                                ))}
                            </div>

                            {/* Content Area */}
                            <AnimatePresence mode="wait">
                                {activeTab === 'saved' ? (
                                    <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4">
                                        {savedCafes.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {savedCafes.map((cafe) => (
                                                    <div key={cafe.id} className="relative group">
                                                        <CafeCard cafe={cafe} />
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                setConfirmRemove({ id: cafe.id, name: cafe.name, type: 'saved' });
                                                            }}
                                                            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center border border-[#EAEEE8] shadow-sm hover:bg-red-50 hover:border-red-100 transition-all group/btn"
                                                        >
                                                            <Heart className="w-4 h-4 fill-[#0b4e9d] text-[#0b4e9d] group-hover/btn:fill-red-400 group-hover/btn:text-red-400" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-24 bg-white border border-[#EAEEE8] rounded-[2.5rem]">
                                                <BookmarkX size={40} className="mx-auto mb-4 text-[#0b4e9d]/10" />
                                                <h3 className="text-xl font-black italic text-[#1E2020] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No saved cafés.</h3>
                                                <p className="text-sm text-[#7A8478] mb-8 opacity-70">Tap HEART on any café to save it here.</p>
                                                <Link to="/search" className="text-[10px] font-black uppercase tracking-[.2em] bg-[#0b4e9d] text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-[#0b4e9d]/30 transition-shadow">Explore</Link>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : activeTab === 'visited' ? (
                                    <motion.div key="visited" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="space-y-3">
                                        {visitedCafes.length > 0 ? (
                                            visitedCafes.map((cafe) => (
                                                <div key={cafe.id} className="flex items-center bg-white rounded-[2rem] p-4 shadow-sm border border-[#EAEEE8] gap-5 group">
                                                    <Link to={`/cafes/${cafe.id}`} className="w-20 h-20 rounded-[1.5rem] overflow-hidden flex-shrink-0 relative">
                                                        <img src={cafe.photos[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={cafe.name} />
                                                        <div className="absolute inset-0 bg-black/5" />
                                                    </Link>
                                                    <div className="flex-1 min-w-0">
                                                        <Link to={`/cafes/${cafe.id}`}>
                                                            <h3 className="font-black text-lg truncate text-[#0b4e9d] italic mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{cafe.name}</h3>
                                                        </Link>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-[#A8B0A0] text-[10px] font-black uppercase tracking-wider">{cafe.area.split(',')[0]}</p>
                                                            <div className="w-1 h-1 rounded-full bg-[#D8DDD0]" />
                                                            <p className="text-[#0b4e9d] text-[10px] font-bold">{getVisitDate(cafe.id)}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setConfirmRemove({ id: cafe.id, name: cafe.name, type: 'visited' })}
                                                        className="w-10 h-10 rounded-2xl flex items-center justify-center hover:bg-red-50 text-[#C8D0C0] hover:text-red-400 transition-colors"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-24 bg-white border border-[#EAEEE8] rounded-[2.5rem]">
                                                <Coffee size={40} className="mx-auto mb-4 text-[#0b4e9d]/10" />
                                                <h3 className="text-xl font-black italic text-[#1E2020] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No visits yet.</h3>
                                                <p className="text-sm text-[#7A8478] mb-8 opacity-70">Mark cafés as visited while you explore.</p>
                                                <Link to="/search" className="text-[10px] font-black uppercase tracking-[.2em] bg-[#0b4e9d] text-white px-8 py-4 rounded-2xl shadow-xl">Start Exploring</Link>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="space-y-4">
                                        {loadingReviews ? (
                                            <div className="flex justify-center py-20">
                                                <div className="w-8 h-8 border-4 border-[#0b4e9d]/10 border-t-[#0b4e9d] rounded-full animate-spin" />
                                            </div>
                                        ) : allReviews.length > 0 ? (
                                            allReviews.map((review) => (
                                                <div key={review._id} className="bg-white rounded-[2rem] p-6 border border-[#EAEEE8] shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <Link to={`/cafes/${review.cafeId}`}>
                                                                <h4 className="font-black text-[#0b4e9d] italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{review.cafeName}</h4>
                                                            </Link>
                                                            <div className="flex items-center gap-1 text-[#FFB800] mt-1">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star key={i} size={12} className={i < review.rating ? 'fill-[#FFB800]' : 'text-[#EAEEE8]'} />
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] font-bold text-[#A8B0A0] uppercase tracking-wider">{formatDate(review.createdAt)}</span>
                                                    </div>
                                                    {review.comment && (
                                                        <p className="text-sm text-[#4A4E4F] italic leading-relaxed">"{review.comment}"</p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-24 bg-white border border-[#EAEEE8] rounded-[2.5rem]">
                                                <Edit3 size={40} className="mx-auto mb-4 text-[#0b4e9d]/10" />
                                                <h3 className="text-xl font-black italic text-[#1E2020] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>No reviews yet.</h3>
                                                <p className="text-sm text-[#7A8478] mb-8 opacity-70">Share your thoughts on the cafés you visit.</p>
                                                <Link to="/search" className="text-[10px] font-black uppercase tracking-[.2em] bg-[#0b4e9d] text-white px-8 py-4 rounded-2xl shadow-xl">Start Exploring</Link>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};
