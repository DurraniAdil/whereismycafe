import { Cafe, Vibe } from '../types/cafe';

// ── API base URL ────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function getAllCafes(): Promise<Cafe[]> {
  const res = await fetch(`${API_BASE}/api/cafes`);
  if (!res.ok) throw new Error('Failed to fetch cafes');
  return res.json();
}

export async function getCafeById(id: string): Promise<Cafe | null> {
  const res = await fetch(`${API_BASE}/api/cafes/${id}`);
  if (!res.ok) return null;
  return res.json();
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
