import { useState, useEffect } from 'react';
import { Cafe, Vibe, NoiseLevel, Lighting, MusicType } from '../types/cafe';

const API_BASE = 'https://wimc-api-production.up.railway.app'; // Target production API

export function Admin() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('wimc_admin_token'));
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'add' | 'edit'>('all');
    const [cafes, setCafes] = useState<Cafe[]>([]);
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

    // Fetch all cafes for the dashboard
    const fetchCafes = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/cafes`); // Flat array query without pagination
            if (res.ok) {
                const data = await res.json();
                setCafes(data);
            }
        } catch (err) {
            console.error(err);
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

    // Login View
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                <form onSubmit={handleLogin} className="w-full max-w-sm bg-white p-8 rounded shadow-sm border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">WIMC Admin</h2>
                    {error && <div className="mb-4 text-red-600 text-sm text-center">{error}</div>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Login'}
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-20">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <button onClick={handleLogout} className="text-red-600 hover:underline">Logout</button>
            </div>

            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                    className={`pb-2 px-1 ${activeTab === 'all' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Cafés
                </button>
                <button
                    className={`pb-2 px-1 ${activeTab === 'add' ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('add')}
                >
                    Add Café
                </button>
                {activeTab === 'edit' && editingCafe && (
                    <button className="pb-2 px-1 border-b-2 border-blue-600 text-blue-600 font-semibold cursor-default">
                        Editing: {editingCafe.name}
                    </button>
                )}
            </div>

            {activeTab === 'all' && (
                <div className="overflow-x-auto bg-white shadow-sm rounded border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cafes.map((cafe) => (
                                <tr key={cafe.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cafe.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{cafe.area}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{cafe.rating || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleEditClick(cafe)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(cafe.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'add' && <CafeForm token={token!} onSuccess={() => { setActiveTab('all'); fetchCafes(); }} />}
            {activeTab === 'edit' && editingCafe && <CafeForm token={token!} initialData={editingCafe} onSuccess={() => { setActiveTab('all'); setEditingCafe(null); fetchCafes(); }} />}
        </div>
    );
}

// Sub-component for Add/Edit Form
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

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm rounded border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Basic Info</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">ID (Unique)</label>
                        <input name="id" value={formData.id} onChange={handleChange} required disabled={!!initialData} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Price for Two</label>
                            <input type="number" name="priceForTwo" value={formData.priceForTwo} onChange={handleChange} required className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rating (0-5)</label>
                            <input type="number" step="0.1" name="rating" value={formData.rating} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                        </div>
                    </div>
                </div>

                {/* Location & Contact */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Location & Contact</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Area</label>
                            <input name="area" value={formData.area} onChange={handleChange} required className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Zone</label>
                            <input name="zone" value={formData.zone} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Google Maps URL</label>
                        <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleChange} required className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Latitude</label>
                            <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Longitude</label>
                            <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Opening Hours</label>
                        <input name="openingHours" value={formData.openingHours} onChange={handleChange} required className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                    </div>
                </div>

                {/* Ambience & Arrays */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Ambience & Media</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Vibes (Comma separated)</label>
                        <input name="vibes" value={formData.vibes?.join(', ')} onChange={(e) => handleArrayChange('vibes', e.target.value)} placeholder="Chill, Study, Date" className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Photos (Comma separated URLs)</label>
                        <textarea name="photos" value={formData.photos?.join(',\n')} onChange={(e) => handleArrayChange('photos', e.target.value)} rows={3} placeholder="/img1.jpg, /img2.jpg" className="mt-1 block w-full rounded border-gray-300 shadow-sm p-2 border" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Noise</label>
                            <select name="noiseLevel" value={formData.noiseLevel} onChange={handleChange} className="mt-1 w-full border p-1 rounded"><option>Quiet</option><option>Moderate</option><option>Loud</option></select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Lighting</label>
                            <select name="lighting" value={formData.lighting} onChange={handleChange} className="mt-1 w-full border p-1 rounded"><option>Bright</option><option>Warm</option><option>Dim</option></select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Music</label>
                            <select name="music" value={formData.music} onChange={handleChange} className="mt-1 w-full border p-1 rounded"><option>None</option><option>Lo-fi</option><option>Bollywood</option><option>Western</option><option>Live</option></select>
                        </div>
                    </div>
                </div>

                {/* Toggles & Flags */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg border-b pb-2">Switches & Amenities</h3>
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded">
                        <label className="flex items-center space-x-2"><input type="checkbox" name="isTrending" checked={formData.isTrending} onChange={handleChange} /><span>Trending Cafe</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" name="isNewCafe" checked={formData.isNewCafe} onChange={handleChange} /><span>New Cafe</span></label>
                        <label className="flex items-center space-x-2"><input type="checkbox" name="verified" checked={formData.verified} onChange={handleChange} /><span>Verified</span></label>
                    </div>
                    <h4 className="text-sm font-medium mt-4">Amenities</h4>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                        {['wifi', 'ac', 'outdoorSeating', 'powerOutlets', 'boardGames', 'parking'].map((amenity) => (
                            <label key={amenity} className="flex items-center space-x-2 text-sm">
                                <input type="checkbox" name={`amenities.${amenity}`} checked={formData.amenities?.[amenity as keyof Amenities] || false} onChange={handleChange} />
                                <span className="capitalize">{amenity.replace(/([A-Z])/g, ' $1').trim()}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-4 border-t flex justify-end">
                <button type="submit" disabled={loading} className="bg-green-600 text-white font-bold py-2 px-6 rounded shadow hover:bg-green-700 disabled:opacity-50">
                    {loading ? 'Saving...' : (initialData ? 'Update Café' : 'Save New Café')}
                </button>
            </div>
        </form>
    );
}
