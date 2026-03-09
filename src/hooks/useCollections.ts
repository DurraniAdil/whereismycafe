import { useState, useEffect } from 'react';

const KEY = 'wimc_collections';

export interface VisitedEntry {
    id: string;
    date: string;
}

export interface CollectionsState {
    hearted: string[];
    visited: VisitedEntry[];
}

export const useCollections = () => {
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

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(state));
    }, [state]);

    const toggleHeart = (id: string) => {
        setState(prev => {
            const isHearted = prev.hearted.includes(id);
            return {
                ...prev,
                hearted: isHearted ? prev.hearted.filter(s => s !== id) : [...prev.hearted, id]
            };
        });
    };

    const isHearted = (id: string) => state.hearted.includes(id);

    const markVisited = (id: string) => {
        setState(prev => {
            if (prev.visited.some(v => v.id === id)) return prev;
            return {
                ...prev,
                // Add to front so most recent is first
                visited: [{ id, date: new Date().toISOString() }, ...prev.visited]
            };
        });
    };

    const removeVisited = (id: string) => {
        setState(prev => ({
            ...prev,
            visited: prev.visited.filter(v => v.id !== id)
        }));
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
