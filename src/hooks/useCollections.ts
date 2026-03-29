import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';

const KEY = 'wimc_collections';
// API_URL is now imported from ../lib/api

export interface VisitedEntry {
    id: string;
    date: string;
}

export interface CollectionsState {
    hearted: string[];
    visited: VisitedEntry[];
}

export const useCollections = () => {
    const { user } = useAuth();
    const [state, setState] = useState<CollectionsState>(() => {
        try {
            const stored = localStorage.getItem(KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    hearted: Array.isArray(parsed.hearted) ? parsed.hearted : [],
                    visited: Array.isArray(parsed.visited) ? parsed.visited : []
                };
            }
        } catch { }
        return { hearted: [], visited: [] };
    });

    const [synced, setSynced] = useState(false);

    // Fetch from backend on login
    useEffect(() => {
        const fetchCollections = async () => {
            const token = localStorage.getItem('wimc_token');
            if (user && token && !synced) {
                try {
                    // First, sync local data if it exists
                    if (state.hearted.length > 0 || state.visited.length > 0) {
                        await fetch(`${API_URL}/collections/sync`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify(state)
                        });
                        // Clear local after sync
                        localStorage.removeItem(KEY);
                    }

                    // Then fetch latest from backend
                    const response = await fetch(`${API_URL}/collections`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (response.ok) {
                        const data = await response.json();
                        setState(data);
                        setSynced(true);
                    }
                } catch (error) {
                    console.error('Collections sync/fetch failed:', error);
                }
            }
        };

        fetchCollections();
    }, [user, synced]);

    // Persist to local only if NOT logged in
    useEffect(() => {
        if (!user) {
            localStorage.setItem(KEY, JSON.stringify(state));
        }
    }, [state, user]);

    const toggleHeart = async (id: string) => {
        const isCurrentlyHearted = state.hearted.includes(id);

        // Optimistic update
        setState(prev => ({
            ...prev,
            hearted: isCurrentlyHearted
                ? prev.hearted.filter(h => h !== id)
                : [...prev.hearted, id]
        }));

        const token = localStorage.getItem('wimc_token');
        if (user && token) {
            try {
                const response = await fetch(`${API_URL}/collections/toggle`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ cafeId: id })
                });
                if (response.ok) {
                    const data = await response.json();
                    setState(data); // Sync with server state
                } else {
                    // Rollback on error
                    setState(prev => ({
                        ...prev,
                        hearted: isCurrentlyHearted
                            ? [...prev.hearted, id]
                            : prev.hearted.filter(h => h !== id)
                    }));
                }
            } catch (error) {
                console.error('Toggle heart failed:', error);
                // Rollback on error
                setState(prev => ({
                    ...prev,
                    hearted: isCurrentlyHearted
                        ? [...prev.hearted, id]
                        : prev.hearted.filter(h => h !== id)
                }));
            }
        }
    };

    const isHearted = (id: string) => state.hearted.includes(id);

    const markVisited = async (id: string) => {
        if (state.visited.some(v => v.id === id)) return;
        
        const newEntry = { id, date: new Date().toISOString() };
        const token = localStorage.getItem('wimc_token');

        if (user && token) {
            try {
                // We'll use sync for marking visited too for simplicity, or we could add a dedicated route
                const response = await fetch(`${API_URL}/collections/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ hearted: state.hearted, visited: [newEntry] })
                });
                if (response.ok) {
                    const data = await response.json();
                    setState(data);
                }
            } catch (error) {
                console.error('Mark visited failed:', error);
            }
        } else {
            setState(prev => ({
                ...prev,
                visited: [newEntry, ...prev.visited]
            }));
        }
    };

    const removeVisited = async (id: string) => {
        const originalVisited = [...state.visited];

        // Optimistic update
        setState(prev => ({
            ...prev,
            visited: prev.visited.filter(v => v.id !== id)
        }));

        const token = localStorage.getItem('wimc_token');
        if (user && token) {
            try {
                const response = await fetch(`${API_URL}/collections/visited/remove`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ cafeId: id })
                });
                if (response.ok) {
                    const data = await response.json();
                    setState(data); // Sync with server
                } else {
                    // Rollback
                    setState(prev => ({ ...prev, visited: originalVisited }));
                }
            } catch (error) {
                console.error('Remove visited failed:', error);
                // Rollback
                setState(prev => ({ ...prev, visited: originalVisited }));
            }
        }
    };

    const isVisited = (id: string) => state.visited.some(v => v.id === id);

    const getVisitDate = (id: string) => {
        const entry = state.visited.find(v => v.id === id);
        if (!entry) return null;
        try {
            return new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(entry.date));
        } catch {
            return 'Invalid Date';
        }
    };

    const clearAll = () => setState({ hearted: [], visited: [] });

    return {
        heartedIds: state.hearted,
        visitedEntries: state.visited,
        toggleHeart,
        isHearted,
        markVisited,
        removeVisited,
        isVisited,
        getVisitDate,
        clearAll
    };
};
