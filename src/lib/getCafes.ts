import cafesData from '../data/cafes.json';
import { Cafe, Vibe, NoiseLevel } from '../types/cafe';

const cafes = cafesData as Cafe[];

export const getAllCafes = (): Cafe[] => cafes;

export const getCafeById = (id: string): Cafe | undefined =>
  cafes.find((c) => c.id === id);

export const getTrendingCafes = (): Cafe[] =>
  cafes.filter((c) => c.isTrending);

export const getNewCafes = (): Cafe[] =>
  cafes.filter((c) => c.isNew);

export const filterByVibe = (vibe: Vibe): Cafe[] =>
  cafes.filter((c) => c.vibes.includes(vibe));

/** Returns sorted, de-duplicated area names from all cafés */
export const getUniqueAreas = (): string[] => {
  const areas = new Set(cafes.map((c) => c.area));
  return Array.from(areas).sort((a, b) => a.localeCompare(b));
};

/**
 * Checks if a café is currently open based on its openingHours string.
 * Handles formats like "9:00 AM – 11:30 PM", "5:00 PM – 11:00 PM",
 * "Open 24 Hours", and closedOn day.
 */
export const isOpenNow = (cafe: Cafe): boolean => {
  const now = new Date();

  // Check if closed today
  if (cafe.closedOn && cafe.closedOn !== 'None') {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];
    if (cafe.closedOn === today) return false;
  }

  const hours = cafe.openingHours;

  // Handle 24 hours
  if (hours.toLowerCase().includes('24 hour')) return true;

  // Parse "9:00 AM – 11:30 PM" format
  const match = hours.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return true; // If we can't parse, assume open

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

  // Handle overnight (e.g., 5:00 PM – 2:00 AM)
  if (closeTime <= openTime) {
    return currentTime >= openTime || currentTime <= closeTime;
  }

  return currentTime >= openTime && currentTime <= closeTime;
};
