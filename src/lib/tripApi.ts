import { API_URL } from './api';
import type { Trip } from '../types/trip';

const getToken = () => localStorage.getItem('wimc_token');

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`
});

export async function createTrip(data: {
  title: string;
  description?: string;
  eventDate: string;
  cafeId?: string;
  cafeName?: string;
  pollCafeOptions?: { cafeId: string; cafeName: string }[];
}): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create trip');
  }
  return res.json();
}

export async function fetchMyTrips(): Promise<{ upcoming: Trip[]; past: Trip[] }> {
  const res = await fetch(`${API_URL}/trips`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch trips');
  return res.json();
}

export async function fetchTripByCode(code: string): Promise<{
  trip: Trip;
  isAuthenticated: boolean;
  currentUserId: string | null;
}> {
  const headers: any = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/trips/invite/${code}`, { headers });
  if (!res.ok) throw new Error('Trip not found');
  return res.json();
}

export async function fetchTrip(tripId: string): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${tripId}`, { headers: authHeaders() });
  if (!res.ok) throw new Error('Failed to fetch trip');
  return res.json();
}

export async function rsvpTrip(tripId: string, status: 'going' | 'maybe' | 'declined'): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${tripId}/rsvp`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'RSVP failed');
  }
  return res.json();
}

export async function voteOnPoll(tripId: string, cafeId: string, newCafeName?: string): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${tripId}/vote`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ cafeId, newCafeName })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Vote failed');
  }
  return res.json();
}

export async function updateTrip(tripId: string, data: Partial<{ title: string; description: string; eventDate: string; status: string }>): Promise<Trip> {
  const res = await fetch(`${API_URL}/trips/${tripId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Update failed');
  }
  return res.json();
}

export async function deleteTrip(tripId: string): Promise<void> {
  const res = await fetch(`${API_URL}/trips/${tripId}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Delete failed');
  }
}

export async function fetchCafesForPicker(): Promise<{ id: string; name: string; area: string; photos: string[] }[]> {
  const res = await fetch(`${API_URL}/cafes`);
  if (!res.ok) throw new Error('Failed to fetch cafes');
  const cafes = await res.json();
  return cafes.map((c: any) => ({ id: c.id, name: c.name, area: c.area, photos: c.photos || [] }));
}
