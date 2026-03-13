import { Cafe, Vibe } from '../types/cafe';

import { API_URL as API_BASE } from './api';

// ── Cache Layer ──────────────────────────────────────────────
let cafesCache: Cafe[] | null = null;
const individualCafeCache: Record<string, Cafe> = {};

export function getCachedCafes(): Cafe[] | null {
  return cafesCache;
}

export function getCachedCafeById(id: string): Cafe | null {
  return individualCafeCache[id] || null;
}

export async function getAllCafes(): Promise<Cafe[]> {
  // Return cache if available
  if (cafesCache) return cafesCache;

  const res = await fetch(`${API_BASE}/cafes`);
  if (!res.ok) throw new Error('Failed to fetch cafes');
  
  const data = await res.json();
  cafesCache = data; // Update cache
  return data;
}

export async function getCafeById(id: string): Promise<Cafe | null> {
  // Return cache if available
  if (individualCafeCache[id]) return individualCafeCache[id];

  const res = await fetch(`${API_BASE}/cafes/${id}`);
  if (!res.ok) return null;
  
  const data = await res.json();
  individualCafeCache[id] = data; // Update cache
  return data;
}

// ── Review API ───────────────────────────────────────────────

export async function getReviewsByCafeId(cafeId: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/cafes/${cafeId}/reviews`);
  if (!res.ok) throw new Error('Failed to fetch reviews');
  return res.json();
}

export async function postReview(cafeId: string, rating: number, comment: string): Promise<any> {
  const res = await fetch(`${API_BASE}/cafes/${cafeId}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rating, comment }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Failed to post review');
  }
  return res.json();
}

export async function getAllReviewsAdmin(token: string): Promise<any[]> {
  const res = await fetch(`${API_BASE}/admin/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch admin reviews');
  return res.json();
}

export async function deleteReviewAdmin(token: string, reviewId: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/reviews/${reviewId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to hide review');
}

// ── Client-side helpers (work on already-fetched data) ──────

export const filterByVibe = (cafes: Cafe[], vibe: Vibe): Cafe[] =>
  cafes.filter((c) => c.vibes.includes(vibe));

export const getUniqueAreas = (cafes: Cafe[]): string[] => {
  const areas = new Set(cafes.map((c) => c.area));
  return Array.from(areas).sort((a, b) => a.localeCompare(b));
};

/**
 * Checks if a café is currently open based on its openingHours string.
 */
export const isOpenNow = (cafe: Cafe): boolean => {
  const now = new Date();

  if (cafe.closedOn && cafe.closedOn !== 'None') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];
    if (cafe.closedOn === today) return false;
  }

  const hours = cafe.openingHours;
  if (hours.toLowerCase().includes('24 hour')) return true;

  const match = hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return true;

  const [, openH, openM, openP, closeH, closeM, closeP] = match;

  const toMinutes = (h: string, m: string, p: string): number => {
    let hour = parseInt(h);
    if (p.toUpperCase() === 'PM' && hour !== 12) hour += 12;
    if (p.toUpperCase() === 'AM' && hour === 12) hour = 0;
    return hour * 60 + parseInt(m);
  };

  const openTime = toMinutes(openH, openM, openP);
  const closeTime = toMinutes(closeH, closeM, closeP);
  const currentTime = now.getHours() * 60 + now.getMinutes();

  if (closeTime <= openTime) {
    return currentTime >= openTime || currentTime <= closeTime;
  }

  return currentTime >= openTime && currentTime <= closeTime;
};
