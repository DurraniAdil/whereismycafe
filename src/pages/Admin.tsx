import React, { useState, useEffect } from 'react';
import { Cafe, Vibe, NoiseLevel, Lighting, MusicType, Amenities } from '../types/cafe';

const API_BASE = 'https://wimc-api-production.up.railway.app'; // Target production API

export function Admin() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('wimc_admin_token'));
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'add' | 'edit'>('all');
    const [cafes, setCafes] = useState<Cafe[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);

    // Login Handler
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });
            const data = await res.json();
            if (res.ok) {
                setToken(data.token);
                localStorage.setItem('wimc_admin_token', data.token);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error');
        }
        setLoading(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('wimc_admin_token');
        setToken(null);
    };

    const fetchCafes = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/cafes`);
            if (res.ok) {
                const data = await res.json();
                setCafes(data);
            } else {
                setCafes([]);
            }
        } catch (err) {
            console.error(err);
            setCafes([]);
        }
    };

    useEffect(() => {
        if (token) fetchCafes();
    }, [token]);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this cafe?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/cafes/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) fetchCafes();
            else alert('Error deleting cafe');
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (cafe: Cafe) => {
        setEditingCafe(cafe);
        setActiveTab('edit');
    };

    // Filter cafes by search query
    const filteredCafes = cafes.filter(cafe =>
        cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.area.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // ── Login View ──────────────────────────────────────────────
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 font-['Plus_Jakarta_Sans']">
                <form onSubmit={handleLogin} className="w-full max-w-sm bg-[#111] p-8 rounded-xl shadow-2xl border border-white/10">
                    <h2 className="text-3xl font-bold mb-8 text-center text-white tracking-tight">
                        WIMC Admin
                    </h2>
                    {error && <div className="mb-6 text-red-500 text-sm text-center bg-red-500/10 py-2 rounded">{error}</div>}
                    <div className="mb-6">
                        <label className="block text-gray-400 text-sm font-medium mb-3">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[#1a1a1a] text-white border border-white/10 rounded-lg focus:outline-none focus:border-[#0b4e9d] focus:ring-1 focus:ring-[#0b4e9d] transition-colors"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#0b4e9d] text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>
            </div>
        );
    }

    // ── Dashboard View ──────────────────────────────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-['Plus_Jakarta_Sans'] pb-20">
            {/* Header */}
            <header className="bg-[#111] border-b border-white/10 sticky top-0 z-10 px-4 sm:px-6 lg:px-8 py-4 mb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl font-bold tracking-tight">
                        WIMC Admin <span className="ml-2 text-xl">☕</span>
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500/10 text-red-500 hover:bg-red-500/20 px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Tabs */}
                <div className="flex space-x-6 mb-8 border-b border-white/10">
                    <button
                        className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'all' ? 'border-b-2 border-[#0b4e9d] text-[#0b4e9d]' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All Cafés
                    </button>
                    <button
                        className={`pb-3 px-1 text-sm font-medium transition-colors ${activeTab === 'add' ? 'border-b-2 border-[#0b4e9d] text-[#0b4e9d]' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setActiveTab('add')}
                    >
                        + Add Café
                    </button>
                    {activeTab === 'edit' && editingCafe && (
                        <button className="pb-3 px-1 text-sm font-medium border-b-2 border-[#f97316] text-[#f97316] cursor-default">
                            Editing: {editingCafe.name}
                        </button>
                    )}
                </div>

                {/* All Cafés Tab */}
                {activeTab === 'all' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                placeholder="Search cafes by name or area..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full max-w-md px-4 py-2 bg-[#1a1a1a] text-white border border-white/10 rounded-lg focus:outline-none focus:border-[#0b4e9d] focus:ring-1 focus:ring-[#0b4e9d] transition-colors"
                            />
                        </div>
                        <div className="overflow-x-auto bg-[#1a1a1a] rounded-xl border border-white/10 shadow-xl">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-[#111]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Area</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredCafes.map((cafe) => (
                                        <tr key={cafe.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{cafe.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">{cafe.area}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-400">{cafe.rating || '—'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button onClick={() => handleEditClick(cafe)} className="text-[#0b4e9d] hover:text-blue-400 mr-4 transition-colors">Edit</button>
                                                <button onClick={() => handleDelete(cafe.id)} className="text-red-500 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredCafes.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                                No cafés found matching "{searchQuery}"
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Forms */}
                {activeTab === 'add' && <CafeForm token={token!} onSuccess={() => { setActiveTab('all'); fetchCafes(); }} />}
                {activeTab === 'edit' && editingCafe && <CafeForm token={token!} initialData={editingCafe} onSuccess={() => { setActiveTab('all'); setEditingCafe(null); fetchCafes(); }} />}
            </div>
        </div>
    );
}

// ── Form Sub-component ────────────────────────────────────────
function CafeForm({ token, initialData, onSuccess }: { token: string; initialData?: Cafe; onSuccess: () => void }) {
    const [formData, setFormData] = useState<Partial<Cafe>>(initialData || {
        id: `cafe-${Date.now()}`,
        name: '', area: '', zone: '', address: '', googleMapsUrl: '',
        phone: '', instagram: '', website: '', openingHours: '9:00 AM – 11:00 PM', closedOn: 'None',
        priceForTwo: 500, cheapestItem: '', popularItem: '', rating: 0,
        vibes: [], noiseLevel: 'Moderate', lighting: 'Bright', music: 'None',
        amenities: { wifi: false, ac: false, outdoorSeating: false, powerOutlets: false, boardGames: false, parking: false },
        description: '', photos: [], isNewCafe: false, isTrending: false, addedOn: new Date().toISOString().split('T')[0],
        verified: false, latitude: 0, longitude: 0
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const method = initialData ? 'PATCH' : 'POST';
        const endpoint = initialData ? `${API_BASE}/api/cafes/${initialData.id}` : `${API_BASE}/api/cafes`;

        try {
            const res = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                onSuccess();
            } else {
                const err = await res.json();
                alert(`Error: ${err.error}`);
            }
        } catch (err) {
            alert('Network error submitting form');
        }
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            if (name.startsWith('amenities.')) {
                const key = name.split('.')[1];
                setFormData((prev) => ({ ...prev, amenities: { ...prev.amenities!, [key]: checked } }));
            } else {
                setFormData((prev) => ({ ...prev, [name]: checked }));
            }
        } else if (name === 'priceForTwo' || name === 'rating' || name === 'latitude' || name === 'longitude') {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleArrayChange = (name: 'vibes' | 'photos', valuesStr: string) => {
        const arr = valuesStr.split(',').map(s => s.trim()).filter(s => s);
        setFormData((prev) => ({ ...prev, [name]: arr }));
    };

    // Shared input class
    const inputClass = "mt-1 box-border w-full px-3 py-2 bg-[#111] text-white border border-white/10 rounded-lg focus:outline-none focus:border-[#0b4e9d] focus:ring-1 focus:ring-[#0b4e9d] transition-colors placeholder:text-gray-600";
    const labelClass = "block text-sm font-medium text-gray-400 mb-1";
    const sectionClass = "bg-[#1a1a1a] p-6 rounded-xl border border-white/5 space-y-5";
    const sectionHeaderClass = "font-semibold text-lg text-white border-b border-white/10 pb-3 mb-4";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Basic Information */}
                <div className={sectionClass}>
                    <h3 className={sectionHeaderClass}>Basic Info</h3>
                    <div>
                        <label className={labelClass}>ID (Unique)</label>
                        <input name="id" value={formData.id} onChange={handleChange} required disabled={!!initialData} className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`} />
                    </div>
                    <div>
                        <label className={labelClass}>Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Price for Two</label>
                            <input type="number" name="priceForTwo" value={formData.priceForTwo} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Rating (0-5)</label>
                            <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                </div>

                {/* Location & Contact */}
                <div className={sectionClass}>
                    <h3 className={sectionHeaderClass}>Location & Contact</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Area</label>
                            <input name="area" value={formData.area} onChange={handleChange} required className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Zone</label>
                            <input name="zone" value={formData.zone} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Google Maps URL</label>
                        <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} required className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Latitude</label>
                            <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className={inputClass} />
                        </div>
                        <div>
                            <label className={labelClass}>Longitude</label>
                            <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className={labelClass}>Opening Hours</label>
                        <input name="openingHours" value={formData.openingHours} onChange={handleChange} required className={inputClass} />
                    </div>
                </div>

                {/* Ambience & Media */}
                <div className={sectionClass}>
                    <h3 className={sectionHeaderClass}>Ambience & Media</h3>
                    <div>
                        <label className={labelClass}>Vibes (Comma separated)</label>
                        <input name="vibes" value={formData.vibes?.join(', ')} onChange={(e) => handleArrayChange('vibes', e.target.value)} placeholder="Chill, Study, Date" className={inputClass} />
                    </div>
                    <div>
                        <label className={labelClass}>Photos (Comma separated URLs)</label>
                        <textarea name="photos" value={formData.photos?.join(',\n')} onChange={(e) => handleArrayChange('photos', e.target.value)} rows={3} placeholder="https://..." className={inputClass} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-2">
                        <div>
                            <label className={labelClass}>Noise</label>
                            <select name="noiseLevel" value={formData.noiseLevel} onChange={handleChange} className={inputClass}><option>Quiet</option><option>Moderate</option><option>Loud</option></select>
                        </div>
                        <div>
                            <label className={labelClass}>Lighting</label>
                            <select name="lighting" value={formData.lighting} onChange={handleChange} className={inputClass}><option>Bright</option><option>Warm</option><option>Dim</option></select>
                        </div>
                        <div>
                            <label className={labelClass}>Music</label>
                            <select name="music" value={formData.music} onChange={handleChange} className={inputClass}><option>None</option><option>Lo-fi</option><option>Bollywood</option><option>Western</option><option>Live</option></select>
                        </div>
                    </div>
                </div>

                {/* Flags & Amenities */}
                <div className={sectionClass}>
                    <h3 className={sectionHeaderClass}>Switches & Amenities</h3>
                    <div className="grid grid-cols-2 gap-4 bg-[#111] p-4 rounded-lg border border-white/5">
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} className="w-4 h-4 accent-[#f97316] bg-[#1a1a1a] border-white/20 rounded" />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Trending Cafe</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" name="isNewCafe" checked={formData.isNewCafe} onChange={handleChange} className="w-4 h-4 accent-[#0b4e9d] bg-[#1a1a1a] border-white/20 rounded" />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">New Cafe</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} className="w-4 h-4 accent-[#0b4e9d] bg-[#1a1a1a] border-white/20 rounded" />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Verified Partner</span>
                        </label>
                    </div>

                    <div className="pt-4">
                        <h4 className="text-sm font-semibold text-white mb-3">Amenities</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {['wifi', 'ac', 'outdoorSeating', 'powerOutlets', 'boardGames', 'parking'].map((amenity) => (
                                <label key={amenity} className="flex items-center space-x-3 cursor-pointer group">
                                    <input type="checkbox" name={`amenities.${amenity}`} checked={formData.amenities?.[amenity as keyof Amenities] || false} onChange={handleChange} className="w-4 h-4 accent-[#0b4e9d] bg-[#111] border-white/20 rounded cursor-pointer" />
                                    <span className="text-sm capitalize text-gray-400 group-hover:text-gray-200 transition-colors">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Bar */}
            <div className="sticky bottom-0 mt-8 p-4 bg-[#111] border-t border-white/10 flex justify-end items-center rounded-xl shadow-2xl z-10">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#0b4e9d] text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-blue-900/20 hover:bg-blue-600 disabled:opacity-50 transition-all active:scale-95"
                >
                    {loading ? 'Saving to Database...' : (initialData ? 'Save Changes' : 'Publish New Café')}
                </button>
            </div>
        </form>
    );
}
